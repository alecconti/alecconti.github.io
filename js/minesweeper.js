// minesweeper.js - Minesweeper game implementation

// Minesweeper game state
let minesweeperState = {
    grid: [],
    width: 9,
    height: 9,
    mines: 10,
    flagsPlaced: 0,
    gameOver: false,
    gameWon: false,
    timer: 0,
    timerInterval: null,
    firstClick: true
};

// Initialize minesweeper game
function initializeMinesweeper(windowElement) {
    const contentContainer = windowElement.querySelector('.window-content');
    
    // Create game container
    contentContainer.innerHTML = `
        <div class="minesweeper-content">
            <div class="minesweeper-controls">
                <div class="minesweeper-counter" id="mine-counter">010</div>
                <div class="minesweeper-face" id="mine-face">😊</div>
                <div class="minesweeper-counter" id="time-counter">000</div>
            </div>
            <div class="minesweeper-grid" id="mine-grid"></div>
        </div>
    `;
    
    // Get game elements
    const grid = contentContainer.querySelector('#mine-grid');
    const face = contentContainer.querySelector('#mine-face');
    const mineCounter = contentContainer.querySelector('#mine-counter');
    const timeCounter = contentContainer.querySelector('#time-counter');
    
    // Reset game state
    resetMinesweeperGame();
    
    // Create grid cells
    createMinesweeperGrid(grid);
    
    // Add face button functionality
    face.addEventListener('click', () => {
        resetMinesweeperGame();
        createMinesweeperGrid(grid);
        playSound('click-sound');
    });
    
    // Update mine counter display
    updateMineCounter();
}

// Create minesweeper grid
function createMinesweeperGrid(gridElement) {
    // Clear existing grid
    gridElement.innerHTML = '';
    
    // Create grid cells
    for (let y = 0; y < minesweeperState.height; y++) {
        for (let x = 0; x < minesweeperState.width; x++) {
            const cell = document.createElement('div');
            cell.className = 'minesweeper-cell';
            cell.setAttribute('data-x', x);
            cell.setAttribute('data-y', y);
            
            // Add click handlers
            cell.addEventListener('click', (e) => {
                handleCellClick(x, y);
            });
            
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleCellRightClick(x, y);
            });
            
            // Add to grid
            gridElement.appendChild(cell);
        }
    }
    
    // Update grid style to match dimensions
    gridElement.style.gridTemplateColumns = `repeat(${minesweeperState.width}, 16px)`;
    gridElement.style.gridTemplateRows = `repeat(${minesweeperState.height}, 16px)`;
}

// Reset minesweeper game
function resetMinesweeperGame() {
    // Reset game state
    minesweeperState.grid = [];
    minesweeperState.flagsPlaced = 0;
    minesweeperState.gameOver = false;
    minesweeperState.gameWon = false;
    minesweeperState.timer = 0;
    minesweeperState.firstClick = true;
    
    // Reset face
    const face = document.getElementById('mine-face');
    if (face) face.textContent = '😊';
    
    // Reset timer
    clearInterval(minesweeperState.timerInterval);
    minesweeperState.timerInterval = null;
    const timeCounter = document.getElementById('time-counter');
    if (timeCounter) timeCounter.textContent = '000';
    
    // Initialize empty grid
    for (let y = 0; y < minesweeperState.height; y++) {
        const row = [];
        for (let x = 0; x < minesweeperState.width; x++) {
            row.push({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            });
        }
        minesweeperState.grid.push(row);
    }
}

// Place mines randomly (after first click)
function placeMines(safeX, safeY) {
    let minesPlaced = 0;
    
    while (minesPlaced < minesweeperState.mines) {
        const x = Math.floor(Math.random() * minesweeperState.width);
        const y = Math.floor(Math.random() * minesweeperState.height);
        
        // Don't place mine on the first clicked cell or existing mines
        if ((x !== safeX || y !== safeY) && !minesweeperState.grid[y][x].isMine) {
            minesweeperState.grid[y][x].isMine = true;
            minesPlaced++;
        }
    }
    
    // Calculate adjacent mines for each cell
    for (let y = 0; y < minesweeperState.height; y++) {
        for (let x = 0; x < minesweeperState.width; x++) {
            if (!minesweeperState.grid[y][x].isMine) {
                let count = 0;
                
                // Check all 8 adjacent cells
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        
                        const nx = x + dx;
                        const ny = y + dy;
                        
                        if (nx >= 0 && nx < minesweeperState.width && 
                            ny >= 0 && ny < minesweeperState.height && 
                            minesweeperState.grid[ny][nx].isMine) {
                            count++;
                        }
                    }
                }
                
                minesweeperState.grid[y][x].adjacentMines = count;
            }
        }
    }
}

// Start the timer
function startTimer() {
    if (minesweeperState.timerInterval) return;
    
    const timeCounter = document.getElementById('time-counter');
    
    minesweeperState.timerInterval = setInterval(() => {
        minesweeperState.timer++;
        
        // Cap at 999
        if (minesweeperState.timer > 999) {
            minesweeperState.timer = 999;
            clearInterval(minesweeperState.timerInterval);
        }
        
        // Update display
        if (timeCounter) {
            timeCounter.textContent = minesweeperState.timer.toString().padStart(3, '0');
        }
    }, 1000);
}

// Handle cell click
function handleCellClick(x, y) {
    // Ignore clicks if game is over or cell is flagged
    if (minesweeperState.gameOver || minesweeperState.grid[y][x].isFlagged) {
        return;
    }
    
    // First click logic
    if (minesweeperState.firstClick) {
        minesweeperState.firstClick = false;
        placeMines(x, y);
        startTimer();
    }
    
    // Get the cell
    const cell = minesweeperState.grid[y][x];
    
    // Handle mine click
    if (cell.isMine) {
        gameOver(false);
        revealAllMines();
        return;
    }
    
    // Reveal cell
    revealCell(x, y);
    
    // Check win condition
    checkWinCondition();
}

// Handle right-click (flag placement)
function handleCellRightClick(x, y) {
    // Ignore right-clicks if game is over or cell is revealed
    if (minesweeperState.gameOver || minesweeperState.grid[y][x].isRevealed) {
        return;
    }
    
    // Toggle flag
    const cell = minesweeperState.grid[y][x];
    cell.isFlagged = !cell.isFlagged;
    
    // Update flags counter
    minesweeperState.flagsPlaced += cell.isFlagged ? 1 : -1;
    updateMineCounter();
    
    // Update cell display
    updateCellDisplay(x, y);
    
    // Check win condition
    checkWinCondition();
}

// Reveal a cell
function revealCell(x, y) {
    // Get the cell
    const cell = minesweeperState.grid[y][x];
    
    // Ignore if already revealed or flagged
    if (cell.isRevealed || cell.isFlagged) {
        return;
    }
    
    // Mark as revealed
    cell.isRevealed = true;
    
    // Update cell display
    updateCellDisplay(x, y);
    
    // If cell has no adjacent mines, reveal adjacent cells
    if (cell.adjacentMines === 0) {
        // Reveal all 8 adjacent cells
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < minesweeperState.width && 
                    ny >= 0 && ny < minesweeperState.height) {
                    revealCell(nx, ny);
                }
            }
        }
    }
}

// Update cell display
function updateCellDisplay(x, y) {
    const cellElement = document.querySelector(`.minesweeper-cell[data-x="${x}"][data-y="${y}"]`);
    if (!cellElement) return;
    
    const cell = minesweeperState.grid[y][x];
    
    if (cell.isRevealed) {
        cellElement.classList.add('revealed');
        
        if (cell.isMine) {
            cellElement.classList.add('mine');
        } else if (cell.adjacentMines > 0) {
            cellElement.textContent = cell.adjacentMines;
            cellElement.setAttribute('data-value', cell.adjacentMines);
        }
    } else if (cell.isFlagged) {
        cellElement.classList.add('flagged');
    } else {
        cellElement.classList.remove('revealed', 'mine', 'flagged');
        cellElement.textContent = '';
        cellElement.removeAttribute('data-value');
    }
}

// Reveal all mines (when game is lost)
function revealAllMines() {
    for (let y = 0; y < minesweeperState.height; y++) {
        for (let x = 0; x < minesweeperState.width; x++) {
            const cell = minesweeperState.grid[y][x];
            if (cell.isMine) {
                cell.isRevealed = true;
                updateCellDisplay(x, y);
            }
        }
    }
}

// Update mine counter display
function updateMineCounter() {
    const mineCounter = document.getElementById('mine-counter');
    if (mineCounter) {
        const remainingMines = Math.max(0, minesweeperState.mines - minesweeperState.flagsPlaced);
        mineCounter.textContent = remainingMines.toString().padStart(3, '0');
    }
}

// Game over handling
function gameOver(isWin) {
    minesweeperState.gameOver = true;
    minesweeperState.gameWon = isWin;
    
    // Stop timer
    clearInterval(minesweeperState.timerInterval);
    
    // Update face
    const face = document.getElementById('mine-face');
    if (face) {
        face.textContent = isWin ? '😎' : '😵';
    }
    
    // Play sound
    playSound(isWin ? 'click-sound' : 'error-sound');
}

// Check win condition
function checkWinCondition() {
    // Count unrevealed cells
    let unrevealedNonMines = 0;
    
    for (let y = 0; y < minesweeperState.height; y++) {
        for (let x = 0; x < minesweeperState.width; x++) {
            const cell = minesweeperState.grid[y][x];
            if (!cell.isRevealed && !cell.isMine) {
                unrevealedNonMines++;
            }
        }
    }
    
    // Win if all non-mine cells are revealed
    if (unrevealedNonMines === 0) {
        gameOver(true);
        
        // Flag all mines
        for (let y = 0; y < minesweeperState.height; y++) {
            for (let x = 0; x < minesweeperState.width; x++) {
                const cell = minesweeperState.grid[y][x];
                if (cell.isMine && !cell.isFlagged) {
                    cell.isFlagged = true;
                    updateCellDisplay(x, y);
                }
            }
        }
        
        // Update mine counter
        minesweeperState.flagsPlaced = minesweeperState.mines;
        updateMineCounter();
    }
}