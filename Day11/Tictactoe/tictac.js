// ========== GAME BOARD DATA ==========
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let player1Symbol = 'X';
let player2Symbol = 'O';
let gameOver = false;
let player1Wins = 0;
let player2Wins = 0;

// Winning combinations
let winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// ========== GET HTML ELEMENTS ==========
let cells = document.querySelectorAll('.cell');
let gameStatus = document.getElementById('gameStatus');
let statusDetail = document.getElementById('statusDetail');
let player1ScoreDisplay = document.getElementById('player1Score');
let player2ScoreDisplay = document.getElementById('player2Score');
let resetBtn = document.getElementById('resetBtn');
let restartBtn = document.getElementById('restartBtn');

// ========== ADD CLICK LISTENERS TO CELLS ==========
cells.forEach(function(cell) {
    cell.addEventListener('click', makeMove);
});

resetBtn.addEventListener('click', newGame);
restartBtn.addEventListener('click', resetAllScores);

// ========== MAKE A MOVE ==========
function makeMove(event) {
    let cell = event.target;
    let cellIndex = cell.getAttribute('data-index');
    
    // Check if cell is empty and game is not over
    if (board[cellIndex] !== '' || gameOver === true) {
        return;
    }
    
    // Current player puts their symbol in the cell
    board[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    
    // Add color class
    if (currentPlayer === 'X') {
        cell.classList.add('x');
    } else {
        cell.classList.add('o');
    }
    
    // Check if current player won
    if (didPlayerWin(currentPlayer)) {
        if (currentPlayer === 'X') {
            gameStatus.textContent = 'Player 1 Wins! 🎉';
            statusDetail.textContent = 'Player 1 (X) won!';
            player1Wins = player1Wins + 1;
            player1ScoreDisplay.textContent = 'Wins: ' + player1Wins;
        } else {
            gameStatus.textContent = 'Player 2 Wins! 🎉';
            statusDetail.textContent = 'Player 2 (O) won!';
            player2Wins = player2Wins + 1;
            player2ScoreDisplay.textContent = 'Wins: ' + player2Wins;
        }
        gameOver = true;
        return;
    }
    
    // Check if board is full (draw)
    if (isBoardFull()) {
        gameStatus.textContent = "It's a Draw! 🤝";
        statusDetail.textContent = 'Nobody won!';
        gameOver = true;
        return;
    }
    
    // Switch to other player
    if (currentPlayer === 'X') {
        currentPlayer = 'O';
        gameStatus.textContent = 'Player 2 Turn';
        statusDetail.textContent = 'O';
    } else {
        currentPlayer = 'X';
        gameStatus.textContent = 'Player 1 Turn';
        statusDetail.textContent = 'X';
    }
}

// ========== CHECK IF SOMEONE WON ==========
function didPlayerWin(symbol) {
    for (let i = 0; i < winCombinations.length; i++) {
        let combination = winCombinations[i];
        let index1 = combination[0];
        let index2 = combination[1];
        let index3 = combination[2];
        
        if (board[index1] === symbol && 
            board[index2] === symbol && 
            board[index3] === symbol) {
            return true;
        }
    }
    return false;
}

// ========== CHECK IF BOARD IS FULL ==========
function isBoardFull() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            return false;
        }
    }
    return true;
}

// ========== START A NEW GAME ==========
function newGame() {
    // Clear board
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    gameStatus.textContent = 'Player 1 Turn';
    statusDetail.textContent = 'X';
    
    // Clear all cells
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = '';
        cells[i].classList.remove('x');
        cells[i].classList.remove('o');
        cells[i].classList.remove('winner');
        cells[i].classList.remove('disabled');
    }
}

// ========== RESET ALL SCORES ==========
function resetAllScores() {
    player1Wins = 0;
    player2Wins = 0;
    player1ScoreDisplay.textContent = 'Wins: 0';
    player2ScoreDisplay.textContent = 'Wins: 0';
    newGame();
}

// ========== INITIALIZE THE GAME ==========
player1ScoreDisplay.textContent = 'Wins: ' + player1Wins;
player2ScoreDisplay.textContent = 'Wins: ' + player2Wins;
