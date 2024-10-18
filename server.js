const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from "public" directory
app.use(express.static("public"));

// Chess Game Logic (without external libraries)
class ChessGame {
  constructor() {
    this.board = this.initializeBoard();
    this.currentTurn = "white";
    this.moves = [];
    this.isGameOver = false;
  }

  initializeBoard() {
    // Set up an 8x8 chess board with pieces in their initial positions
    return [
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"]
    ];
  }

  movePiece(from, to) {
    if (this.isGameOver) {
      return false;
    }

    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const piece = this.board[fromRow][fromCol];
    const targetPiece = this.board[toRow][toCol];

    // Full chess rules validation
    if (!this.isValidMove(from, to, piece, targetPiece)) {
      return false;
    }

    // Perform the move
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = "";
    this.moves.push({ from, to });

    // Handle pawn promotion
    if (piece === 'P' && toRow === 0) {
      this.board[toRow][toCol] = 'Q'; // Promote white pawn to queen
    } else if (piece === 'p' && toRow === 7) {
      this.board[toRow][toCol] = 'q'; // Promote black pawn to queen
    }

    // Check for checkmate
    if (this.isCheckmate()) {
      this.isGameOver = true;
      return "checkmate";
    }

    this.currentTurn = this.currentTurn === "white" ? "black" : "white";
    return true;
  }

  isValidMove(from, to, piece, targetPiece) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    if (!piece) return false; // No piece at the source
    if ((piece === piece.toUpperCase() && this.currentTurn !== "white") ||
        (piece === piece.toLowerCase() && this.currentTurn !== "black")) {
      return false; // Not the player's turn
    }
    if (targetPiece !== "" && ((piece === piece.toLowerCase() && targetPiece === targetPiece.toLowerCase()) || (piece === piece.toUpperCase() && targetPiece === targetPiece.toUpperCase()))) {
      return false; // Cannot capture own piece
    }

    // Piece-specific movement validation
    switch (piece.toLowerCase()) {
      case "p": // Pawn
        return this.isValidPawnMove(from, to, piece, targetPiece);
      case "r": // Rook
        return this.isValidRookMove(from, to);
      case "n": // Knight
        return this.isValidKnightMove(from, to);
      case "b": // Bishop
        return this.isValidBishopMove(from, to);
      case "q": // Queen
        return this.isValidQueenMove(from, to);
      case "k": // King
        return this.isValidKingMove(from, to);
      default:
        return false;
    }
  }

  isValidPawnMove(from, to, piece, targetPiece) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const direction = piece === "P" ? -1 : 1;
    const startRow = piece === "P" ? 6 : 1;

    // Normal move
    if (fromCol === toCol && targetPiece === "") {
      if (toRow === fromRow + direction) return true;
      if (fromRow === startRow && toRow === fromRow + 2 * direction && this.board[fromRow + direction][fromCol] === "") return true;
    }
    // Capture move
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && targetPiece !== "") {
      return true;
    }
    return false;
  }

  isValidRookMove(from, to) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    if (fromRow !== toRow && fromCol !== toCol) return false;
    return this.isPathClear(from, to);
  }

  isValidKnightMove(from, to) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  isValidBishopMove(from, to) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;
    return this.isPathClear(from, to);
  }

  isValidQueenMove(from, to) {
    return this.isValidRookMove(from, to) || this.isValidBishopMove(from, to);
  }

  isValidKingMove(from, to) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    if (rowDiff <= 1 && colDiff <= 1) {
      // Castling logic
      if (!this.hasKingMoved(piece, from, to) && Math.abs(fromCol - toCol) === 2) {
        if (this.canCastle(from, to)) {
          return true;
        }
      }
      return true;
    }
    return false;
  }

  canCastle(from, to) {
    // Logic to verify if castling is possible
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    if (fromRow !== toRow) return false;
    if (Math.abs(fromCol - toCol) !== 2) return false;

    const rookCol = toCol > fromCol ? 7 : 0;
    const rook = this.board[fromRow][rookCol];
    if ((this.currentTurn === "white" && rook !== "R") || (this.currentTurn === "black" && rook !== "r")) {
      return false;
    }

    return this.isPathClear(from, [fromRow, rookCol]);
  }

  hasKingMoved(piece, from, to) {
    return this.moves.some((move) => move.piece.toLowerCase() === 'k' && move.from === from);
  }

  isPathClear(from, to) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const rowDirection = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colDirection = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

    let currentRow = fromRow + rowDirection;
    let currentCol = fromCol + colDirection;
    while (currentRow !== toRow || currentCol !== toCol) {
      if (this.board[currentRow][currentCol] !== "") return false;
      currentRow += rowDirection;
      currentCol += colDirection;
    }
    return true;
  }

  isCheckmate() {
    const kingPosition = this.findKing(this.currentTurn === "white" ? "K" : "k");
    if (!kingPosition) {
      return true;
    }
    // Check if the current player's king has no valid moves left
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if ((this.currentTurn === "white" && piece === piece.toUpperCase()) ||
            (this.currentTurn === "black" && piece === piece.toLowerCase())) {
          if (this.hasValidMoves([row, col])) {
            return false;
          }
        }
      }
    }
    return true;
  }

  hasValidMoves(position) {
    const [fromRow, fromCol] = position;
    const piece = this.board[fromRow][fromCol];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.isValidMove(position, [row, col], piece, this.board[row][col])) {
          return true;
        }
      }
    }
    return false;
  }

  findKing(king) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === king) {
          return [row, col];
        }
      }
    }
    return null;
  }

  getBoard() {
    return this.board;
  }

  getMoves() {
    return this.moves;
  }

  resetGame() {
    this.board = this.initializeBoard();
    this.currentTurn = "white";
    this.moves = [];
    this.isGameOver = false;
  }
}

// Create a new game instance
const game = new ChessGame();

// Listening for clients
io.on("connection", (socket) => {
  console.log("A user connected");
  
  // Send the initial game state to the connected client
  socket.emit("gameState", game.getBoard());
  socket.emit("gameHistory", game.getMoves());
  socket.emit("currentTurn", game.currentTurn);

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Handling moves from clients
  socket.on("move", (move) => {
    const result = game.movePiece(move.from, move.to);
    if (result === "checkmate") {
      io.emit("gameState", game.getBoard()); // Broadcast updated game state
      io.emit("gameHistory", game.getMoves()); // Broadcast updated game history
      io.emit("currentTurn", game.currentTurn); // Broadcast current turn
      io.emit("gameOver", "Checkmate! Game over."); // Notify players of game over
    } else if (result) {
      io.emit("move", move); // Broadcast move to all clients
      io.emit("gameState", game.getBoard()); // Broadcast updated game state
      io.emit("gameHistory", game.getMoves()); // Broadcast updated game history
      io.emit("currentTurn", game.currentTurn); // Broadcast current turn
    } else {
      socket.emit("invalidMove", "Invalid move, please try again.");
    }
  });

  // Handling new game request
  socket.on("newGame", () => {
    game.resetGame();
    io.emit("gameState", game.getBoard()); // Broadcast new game state
    io.emit("gameHistory", game.getMoves()); // Clear game history
    io.emit("currentTurn", game.currentTurn); // Reset current turn
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});