# Chess Game - Node.js Implementation

## Overview
This project is a simple, playable chess game built using Node.js for the backend and HTML/CSS/JavaScript for the frontend. The game includes a fully functional chessboard, game rules validation, move history tracking, and visual elements to make it user-friendly and enjoyable. The primary technologies used include:

- **Node.js**: Backend server for game logic.
- **Socket.IO**: Real-time communication between server and clients.
- **HTML/CSS/JavaScript**: Frontend for visualizing the chessboard.
- **Tailwind CSS**: Styling of the user interface.

The chess game allows players to take turns moving pieces according to standard chess rules, while also keeping a detailed move history displayed alongside the board.

## Features
- **Chess Game Logic**: Implements full chess rules, including piece-specific movements, capturing, castling, pawn promotion, and checkmate detection.
- **Real-time Multiplayer**: Uses Socket.IO to allow for real-time gameplay between two players.
- **Move History**: Displays a sidebar showing all moves in real-time, including captures, using standard chess notation.
- **Visual Enhancements**: Includes piece icons for a better visual experience, highlights selected pieces, and provides animations to indicate valid moves.
- **Persistent State**: Game state and move history are saved using local storage, allowing players to continue a game if they reload the page.

## Setup Instructions
### Prerequisites
- Node.js and npm installed on your local machine.

### Installation
1. **Clone the Repository**:
   ```sh
   git clone https://github.com/BitSparkCode/chess.git
   cd chess
   ```

2. **Install Dependencies**:
   ```sh
   npm install express socket.io
   ```

3. **Run the Server**:
   ```sh
   node server.js
   ```

4. **Open the Game**:
   - Navigate to `http://localhost:3000` in your browser to start playing.

### Playing Against AI
To play against the AI opponent, select "Play Against AI" from the game options. The AI will make a move each time it's its turn, providing a fun way to practice.

## Project Structure
- **server.js**: The Node.js backend that manages the game state and serves the frontend files.
- **public/**: Directory containing all the frontend assets (HTML, CSS, JavaScript).
  - **index.html**: The main HTML file for displaying the chessboard and move history.
  - **app.js**: Handles frontend logic, including board rendering and interaction with the server.
  - **styles.css**: Contains styling for the chessboard and other UI components.
- **ai.js**: A simple AI module that makes random legal moves, allowing single-player mode against a computer opponent.

## Gameplay Instructions
- **Starting a New Game**: Click the "New Game" button on the top navigation bar to reset the game.
- **Making Moves**: Click on a piece to select it, then click on the target square to move it. If the move is invalid, a notification will appear.
- **Move History**: The sidebar on the right shows the history of all moves made, using standard chess notation. 

## Technologies Used
- **Node.js**: For handling backend logic and serving frontend files.
- **Socket.IO**: Enables real-time updates for multiplayer play.
- **HTML, CSS (Tailwind), JavaScript**: Used for creating an interactive and visually appealing frontend.
- **Font Awesome**: Provides icons for chess pieces to enhance the visual experience.
