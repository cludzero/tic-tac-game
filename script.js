const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const changeModeBtn = document.getElementById('changeModeBtn');
const modeSelection = document.getElementById('modeSelection');
const gameContainer = document.getElementById('gameContainer');
const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let isSinglePlayer = false;
let isAIThinking = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame(singlePlayer) {
    isSinglePlayer = singlePlayer;
    modeSelection.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    handleReset();
}

function changeMode() {
    gameContainer.classList.add('hidden');
    modeSelection.classList.remove('hidden');
    handleReset();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive || isAIThinking) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (isSinglePlayer && currentPlayer === 'O' && gameActive) {
        isAIThinking = true;
        setTimeout(() => {
            makeAIMove();
            isAIThinking = false;
        }, 500);
    }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

function handleResultValidation() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            winningCells = winCondition;
            break;
        }
    }

    if (roundWon) {
        if (isSinglePlayer) {
            statusDisplay.textContent = currentPlayer === 'X' ? '你贏了！' : 'AI 獲勝！';
        } else {
            statusDisplay.textContent = `玩家 ${currentPlayer} 獲勝！`;
        }
        gameActive = false;
        highlightWinningCells(winningCells);
        return;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.textContent = '平局！';
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function highlightWinningCells(winningCells) {
    winningCells.forEach(index => {
        cells[index].classList.add('winning');
    });
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (isSinglePlayer) {
        statusDisplay.textContent = currentPlayer === 'X' ? '你的回合' : 'AI 思考中...';
    } else {
        statusDisplay.textContent = `輪到玩家 ${currentPlayer}`;
    }
}

function makeAIMove() {
    if (!gameActive) return;

    const random = Math.random();
    let move = -1;

    if (random < 0.4) {
        move = findWinningMove('O');
    }

    if (move === -1 && random < 0.8) {
        move = findWinningMove('X');
    }

    if (move === -1) {
        move = getRandomMove();
    }

    if (move !== -1) {
        const cell = cells[move];
        handleCellPlayed(cell, move);
        handleResultValidation();
    }
}

function findWinningMove(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        const cells = [gameState[a], gameState[b], gameState[c]];

        if (cells.filter(cell => cell === player).length === 2 &&
            cells.includes('')) {
            if (gameState[a] === '') return a;
            if (gameState[b] === '') return b;
            if (gameState[c] === '') return c;
        }
    }
    return -1;
}

function getRandomMove() {
    const availableMoves = [];
    gameState.forEach((cell, index) => {
        if (cell === '') {
            availableMoves.push(index);
        }
    });

    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    return -1;
}

function handleReset() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    isAIThinking = false;

    if (isSinglePlayer) {
        statusDisplay.textContent = '你的回合';
    } else {
        statusDisplay.textContent = `輪到玩家 ${currentPlayer}`;
    }

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winning');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleReset);
changeModeBtn.addEventListener('click', changeMode);
singlePlayerBtn.addEventListener('click', () => startGame(true));
twoPlayerBtn.addEventListener('click', () => startGame(false));
