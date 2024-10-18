# Chess Application

This is a simple chess game implementation using Node.js for the backend and HTML/CSS/JavaScript for the frontend. It includes a visual chessboard that players can interact with, and the state of the game is stored locally in the browser. The game also features multiplayer capabilities using Socket.IO and is styled with Tailwind CSS.

## Features

- **Full Chess Game Logic**: The backend implements complete chess rules, including validation for moves by each piece type.
- **Interactive Chessboard**: The frontend provides a visual board where players can drag and drop pieces to make moves.
- **Multiplayer Support**: Uses Socket.IO to handle multiple players in real-time.
- **Persistent Game State**: Uses local storage in the browser to save the game state and move history, allowing players to resume games or review past games.
- **Styled with Tailwind CSS**: The application uses Tailwind CSS for a modern and clean user interface.

## Prerequisites

To run this application, you need to have Node.js installed. You also need the following dependencies:

- **Express**: Used for serving the web application.
- **Socket.IO**: Handles real-time bidirectional event-based communication between the server and clients.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/BitSparkCode/chess.git
   ```

2. Navigate to the project directory:
   ```sh
   cd chess
   ```

3. Install the dependencies:
   ```sh
   npm install express socket.io
   ```

## Running the Application

1. Start the Node.js server:
   ```sh
   node server.js
   ```

2. Open your browser and go to `http://localhost:3000` to view the chess game.

## File Structure

- **server.js**: Node.js backend that manages the game state and communicates with clients using Socket.IO.
- **public/index.html**: The main HTML file for the frontend.
- **public/app.js**: JavaScript file for handling client-side logic such as rendering the board and interacting with the server.
- **public/styles.css**: CSS file for styling the chessboard.

## How to Play

- Click on the piece you want to move, and then click on the target cell to move it.
- The game automatically validates moves according to chess rules.
- Use the **New Game** button to reset the game.
- Click on **Last Games** to view the history of moves from previous games.

## Chess Rules Implementation

The chess rules implemented in the backend include:

- **Pawn Moves**: Handles standard movement, captures, and starting double move.
- **Rook Moves**: Linear movement along rows and columns.
- **Knight Moves**: L-shaped moves.
- **Bishop Moves**: Diagonal moves.
- **Queen Moves**: Combines rook and bishop moves.
- **King Moves**: One cell in any direction.
- **Path Clearance**: Ensures pieces do not move through other pieces unless it's a knight.

## Technologies Used

- **Node.js**: Backend logic and serving files.
- **Socket.IO**: Real-time communication for multiplayer interaction.
- **HTML/CSS/JavaScript**: Frontend for the visual interface.
- **Tailwind CSS**: Provides modern styling.