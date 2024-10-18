const socket = io();

// Create a simple board representation
const boardElement = document.getElementById("board");
const currentTurnElement = document.getElementById("current-turn");
const newGameButton = document.getElementById("new-game");
const movesListElement = document.getElementById("moves-list");

function renderBoard(board) {
    boardElement.innerHTML = "";
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.position = `${row},${col}`;
            cellElement.style.backgroundColor = (row + col) % 2 === 0 ? "#f0d9b5" : "#b58863";
            if (board[row][col] !== "") {
                const pieceIcon = document.createElement("i");
                const classes = getPieceIconClass(board[row][col]).split(" ");
                pieceIcon.classList.add("fas", ...classes);
                cellElement.appendChild(pieceIcon);
            }
            boardElement.appendChild(cellElement);
        }
    }
    saveGameState(board);
}

function getPieceIconClass(piece) {
    switch (piece) {
        case "P": return "fa-chess-pawn text-white";
        case "p": return "fa-chess-pawn text-black";
        case "R": return "fa-chess-rook text-white";
        case "r": return "fa-chess-rook text-black";
        case "N": return "fa-chess-knight text-white";
        case "n": return "fa-chess-knight text-black";
        case "B": return "fa-chess-bishop text-white";
        case "b": return "fa-chess-bishop text-black";
        case "Q": return "fa-chess-queen text-white";
        case "q": return "fa-chess-queen text-black";
        case "K": return "fa-chess-king text-white";
        case "k": return "fa-chess-king text-black";
        default: return "";
    }
}

function saveGameState(board) {
    localStorage.setItem("chessBoard", JSON.stringify(board));
}

function saveMoveHistory(moves) {
    localStorage.setItem("moveHistory", JSON.stringify(moves));
}

function loadGameState() {
    const board = localStorage.getItem("chessBoard");
    if (board) {
        return JSON.parse(board);
    }
    return null;
}

function loadMoveHistory() {
    const moves = localStorage.getItem("moveHistory");
    if (moves) {
        return JSON.parse(moves);
    }
    return [];
}

function updateMoveHistory(moves) {
    movesListElement.innerHTML = "";
    moves.forEach((move, index) => {
        const moveElement = document.createElement("li");
        const moveNumber = Math.floor(index / 2) + 1;
        const moveText = `${moveNumber}. ${index % 2 === 0 ? 'White' : 'Black'}: ${getMoveNotation(move)}`;
        moveElement.textContent = moveText;
        movesListElement.appendChild(moveElement);
    });
}

function getMoveNotation(move) {
    const fromCol = String.fromCharCode(97 + move.from[1]);
    const fromRow = 8 - move.from[0];
    const toCol = String.fromCharCode(97 + move.to[1]);
    const toRow = 8 - move.to[0];
    const pieceIcon = getPieceIconClass(move.piece).split(" ")[0].replace("fa-chess-", "");
    const capture = move.captured ? "x" : "";
    return `${pieceIcon} ${fromCol}${fromRow}${capture} -> ${toCol}${toRow}`;
}

// Handle piece movement
boardElement.addEventListener("click", (event) => {
    const selectedCell = event.target.closest(".cell");
    if (selectedCell) {
        const position = selectedCell.dataset.position.split(",").map(Number);
        if (!window.selectedPiece) {
            window.selectedPiece = position;
            selectedCell.classList.add("selected");
        } else {
            socket.emit("move", { from: window.selectedPiece, to: position });
            document.querySelectorAll(".selected").forEach(cell => cell.classList.remove("selected"));
            window.selectedPiece = null;
        }
    }
});

// New game button handler
newGameButton.addEventListener("click", () => {
    socket.emit("newGame");
});

// Receive move from server and update the board
socket.on("move", (move) => {
    console.log("Move received", move);
});

// Update game state when receiving new game state from server
socket.on("gameState", (board) => {
    renderBoard(board);
});

// Update move history when receiving new game history from server
socket.on("gameHistory", (moves) => {
    saveMoveHistory(moves);
    updateMoveHistory(moves);
});

// Update current turn
socket.on("currentTurn", (turn) => {
    currentTurnElement.textContent = `Turn: ${turn.charAt(0).toUpperCase() + turn.slice(1)}`;
});

// Show invalid move message
socket.on("invalidMove", (message) => {
    const growlElement = document.createElement("div");
    growlElement.classList.add("growl");
    growlElement.textContent = message;
    document.body.appendChild(growlElement);
    setTimeout(() => {
        growlElement.remove();
    }, 3000);
});

// Show game over message
socket.on("gameOver", (message) => {
    const growlElement = document.createElement("div");
    growlElement.classList.add("growl");
    growlElement.textContent = message;
    document.body.appendChild(growlElement);
    setTimeout(() => {
        growlElement.remove();
    }, 5000);
});

// Load previous game state if available
const savedBoard = loadGameState();
if (savedBoard) {
    renderBoard(savedBoard);
    updateMoveHistory(loadMoveHistory());
}