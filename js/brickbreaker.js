// brickbreaker.js - Brick Breaker game implementation for Windows 95 themed portfolio

// Game state
let brickBreakerState = {
    canvas: null,
    ctx: null,
    ballRadius: 5,
    x: 0,
    y: 0,
    dx: 2,
    dy: -2,
    paddleHeight: 10,
    paddleWidth: 50,
    paddleX: 0,
    rightPressed: false,
    leftPressed: false,
    brickRowCount: 5,
    brickColumnCount: 8,
    brickWidth: 30,
    brickHeight: 10,
    brickPadding: 5,
    brickOffsetTop: 30,
    brickOffsetLeft: 15,
    score: 0,
    lives: 3,
    bricks: [],
    gameInterval: null,
    paused: false,
    gameOver: false
};

// Initialize Brick Breaker game
function initializeBrickBreaker(windowElement) {
    const contentContainer = windowElement.querySelector('.window-content');
    
    // Create game container
    contentContainer.innerHTML = `
        <div class="brickbreaker-content">
            <div class="brickbreaker-controls">
                <button id="game-start">Start</button>
                <button id="game-pause">Pause</button>
                <button id="game-reset">Reset</button>
                <div class="game-status">
                    <span>Score: <span id="game-score">0</span></span>
                    <span>Lives: <span id="game-lives">3</span></span>
                </div>
            </div>
            <canvas id="brickbreaker-canvas" width="400" height="300"></canvas>
            <div class="game-message" id="game-message"></div>
        </div>
    `;
    
    // Get game elements
    const canvas = contentContainer.querySelector('#brickbreaker-canvas');
    const startBtn = contentContainer.querySelector('#game-start');
    const pauseBtn = contentContainer.querySelector('#game-pause');
    const resetBtn = contentContainer.querySelector('#game-reset');
    const scoreDisplay = contentContainer.querySelector('#game-score');
    const livesDisplay = contentContainer.querySelector('#game-lives');
    const gameMessage = contentContainer.querySelector('#game-message');
    
    // Initialize canvas
    brickBreakerState.canvas = canvas;
    brickBreakerState.ctx = canvas.getContext('2d');
    
    // Reset game state
    resetBrickBreakerGame();
    
    // Draw initial state
    drawBrickBreaker();
    
    // Add button functionality
    startBtn.addEventListener('click', () => {
        if (brickBreakerState.gameInterval) return;
        if (brickBreakerState.gameOver) resetBrickBreakerGame();
        startGame();
        playSound('click-sound');
    });
    
    pauseBtn.addEventListener('click', () => {
        togglePause();
        playSound('click-sound');
    });
    
    resetBtn.addEventListener('click', () => {
        resetBrickBreakerGame();
        drawBrickBreaker();
        playSound('click-sound');
    });
    
    // Add keyboard listeners for paddle movement
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    
    // Also add mouse movement for paddle control
    canvas.addEventListener('mousemove', mouseMoveHandler);
}

// Reset game state
function resetBrickBreakerGame() {
    // Stop any existing game
    if (brickBreakerState.gameInterval) {
        clearInterval(brickBreakerState.gameInterval);
        brickBreakerState.gameInterval = null;
    }
    
    // Reset game variables
    brickBreakerState.x = brickBreakerState.canvas.width / 2;
    brickBreakerState.y = brickBreakerState.canvas.height - 30;
    brickBreakerState.dx = 2;
    brickBreakerState.dy = -2;
    brickBreakerState.paddleX = (brickBreakerState.canvas.width - brickBreakerState.paddleWidth) / 2;
    brickBreakerState.score = 0;
    brickBreakerState.lives = 3;
    brickBreakerState.paused = false;
    brickBreakerState.gameOver = false;
    
    // Initialize bricks
    brickBreakerState.bricks = [];
    for (let c = 0; c < brickBreakerState.brickColumnCount; c++) {
        brickBreakerState.bricks[c] = [];
        for (let r = 0; r < brickBreakerState.brickRowCount; r++) {
            brickBreakerState.bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    
    // Update score and lives display
    updateScoreDisplay();
    
    // Clear any game messages
    const gameMessage = document.getElementById('game-message');
    if (gameMessage) gameMessage.textContent = '';
}

// Start the game
function startGame() {
    if (brickBreakerState.gameInterval) return;
    brickBreakerState.gameInterval = setInterval(updateGame, 10);
    brickBreakerState.paused = false;
    
    // Hide any game messages
    const gameMessage = document.getElementById('game-message');
    if (gameMessage) gameMessage.textContent = '';
}

// Pause/resume the game
function togglePause() {
    if (brickBreakerState.gameOver) return;
    
    if (brickBreakerState.paused) {
        // Resume game
        brickBreakerState.gameInterval = setInterval(updateGame, 10);
        brickBreakerState.paused = false;
        // Clear pause message
        const gameMessage = document.getElementById('game-message');
        if (gameMessage) gameMessage.textContent = '';
    } else {
        // Pause game
        if (brickBreakerState.gameInterval) {
            clearInterval(brickBreakerState.gameInterval);
            brickBreakerState.gameInterval = null;
        }
        brickBreakerState.paused = true;
        // Show pause message
        const gameMessage = document.getElementById('game-message');
        if (gameMessage) gameMessage.textContent = 'PAUSED';
    }
}

// Update game state
function updateGame() {
    // Clear canvas
    brickBreakerState.ctx.clearRect(0, 0, brickBreakerState.canvas.width, brickBreakerState.canvas.height);
    
    // Draw everything
    drawBrickBreaker();
    
    // Check for collisions with bricks
    collisionDetection();
    
    // Ball bouncing off walls
    if (brickBreakerState.x + brickBreakerState.dx > brickBreakerState.canvas.width - brickBreakerState.ballRadius || 
        brickBreakerState.x + brickBreakerState.dx < brickBreakerState.ballRadius) {
        brickBreakerState.dx = -brickBreakerState.dx;
    }
    
    if (brickBreakerState.y + brickBreakerState.dy < brickBreakerState.ballRadius) {
        brickBreakerState.dy = -brickBreakerState.dy;
    } else if (brickBreakerState.y + brickBreakerState.dy > brickBreakerState.canvas.height - brickBreakerState.ballRadius - brickBreakerState.paddleHeight) {
        if (brickBreakerState.x > brickBreakerState.paddleX && 
            brickBreakerState.x < brickBreakerState.paddleX + brickBreakerState.paddleWidth) {
            // Ball hits paddle
            brickBreakerState.dy = -brickBreakerState.dy;
            
            // Adjust horizontal direction based on where ball hits paddle
            const hitPosition = (brickBreakerState.x - brickBreakerState.paddleX) / brickBreakerState.paddleWidth;
            brickBreakerState.dx = brickBreakerState.dx * 0.8 + (hitPosition - 0.5) * 3;
        } else if (brickBreakerState.y + brickBreakerState.dy > brickBreakerState.canvas.height - brickBreakerState.ballRadius) {
            // Ball goes below paddle
            brickBreakerState.lives--;
            updateScoreDisplay();
            
            if (brickBreakerState.lives === 0) {
                // Game over
                gameOver(false);
            } else {
                // Reset ball and paddle
                brickBreakerState.x = brickBreakerState.canvas.width / 2;
                brickBreakerState.y = brickBreakerState.canvas.height - 30;
                brickBreakerState.dx = 2;
                brickBreakerState.dy = -2;
                brickBreakerState.paddleX = (brickBreakerState.canvas.width - brickBreakerState.paddleWidth) / 2;
            }
        }
    }
    
    // Move the paddle
    if (brickBreakerState.rightPressed) {
        brickBreakerState.paddleX = Math.min(
            brickBreakerState.paddleX + 4, 
            brickBreakerState.canvas.width - brickBreakerState.paddleWidth
        );
    } else if (brickBreakerState.leftPressed) {
        brickBreakerState.paddleX = Math.max(brickBreakerState.paddleX - 4, 0);
    }
    
    // Move the ball
    brickBreakerState.x += brickBreakerState.dx;
    brickBreakerState.y += brickBreakerState.dy;
}

// Draw the ball, paddle, bricks, and score
function drawBrickBreaker() {
    const ctx = brickBreakerState.ctx;
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(brickBreakerState.x, brickBreakerState.y, brickBreakerState.ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();
    
    // Draw paddle
    ctx.beginPath();
    ctx.rect(
        brickBreakerState.paddleX, 
        brickBreakerState.canvas.height - brickBreakerState.paddleHeight, 
        brickBreakerState.paddleWidth, 
        brickBreakerState.paddleHeight
    );
    ctx.fillStyle = "#808080";
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.closePath();
    
    // Draw bricks
    for (let c = 0; c < brickBreakerState.brickColumnCount; c++) {
        for (let r = 0; r < brickBreakerState.brickRowCount; r++) {
            if (brickBreakerState.bricks[c][r].status === 1) {
                const brickX = c * (brickBreakerState.brickWidth + brickBreakerState.brickPadding) + brickBreakerState.brickOffsetLeft;
                const brickY = r * (brickBreakerState.brickHeight + brickBreakerState.brickPadding) + brickBreakerState.brickOffsetTop;
                
                brickBreakerState.bricks[c][r].x = brickX;
                brickBreakerState.bricks[c][r].y = brickY;
                
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickBreakerState.brickWidth, brickBreakerState.brickHeight);
                
                // Different colors for different rows
                switch(r % 5) {
                    case 0: ctx.fillStyle = "#FF0000"; break; // Red
                    case 1: ctx.fillStyle = "#FFA500"; break; // Orange
                    case 2: ctx.fillStyle = "#FFFF00"; break; // Yellow
                    case 3: ctx.fillStyle = "#008000"; break; // Green
                    case 4: ctx.fillStyle = "#0000FF"; break; // Blue
                }
                
                ctx.fill();
                ctx.strokeStyle = "#000000";
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// Check for collisions with bricks
function collisionDetection() {
    for (let c = 0; c < brickBreakerState.brickColumnCount; c++) {
        for (let r = 0; r < brickBreakerState.brickRowCount; r++) {
            const brick = brickBreakerState.bricks[c][r];
            
            if (brick.status === 1) {
                if (
                    brickBreakerState.x > brick.x && 
                    brickBreakerState.x < brick.x + brickBreakerState.brickWidth && 
                    brickBreakerState.y > brick.y && 
                    brickBreakerState.y < brick.y + brickBreakerState.brickHeight
                ) {
                    brickBreakerState.dy = -brickBreakerState.dy;
                    brick.status = 0;
                    brickBreakerState.score += 10;
                    updateScoreDisplay();
                    
                    // Check if all bricks are broken
                    let allBroken = true;
                    for (let c = 0; c < brickBreakerState.brickColumnCount; c++) {
                        for (let r = 0; r < brickBreakerState.brickRowCount; r++) {
                            if (brickBreakerState.bricks[c][r].status === 1) {
                                allBroken = false;
                                break;
                            }
                        }
                        if (!allBroken) break;
                    }
                    
                    if (allBroken) {
                        gameOver(true);
                    }
                }
            }
        }
    }
}

// Update score and lives display
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('game-score');
    const livesDisplay = document.getElementById('game-lives');
    
    if (scoreDisplay) scoreDisplay.textContent = brickBreakerState.score;
    if (livesDisplay) livesDisplay.textContent = brickBreakerState.lives;
}

// Game over handling
function gameOver(isWin) {
    if (brickBreakerState.gameInterval) {
        clearInterval(brickBreakerState.gameInterval);
        brickBreakerState.gameInterval = null;
    }
    
    brickBreakerState.gameOver = true;
    
    // Display game over message
    const gameMessage = document.getElementById('game-message');
    if (gameMessage) {
        if (isWin) {
            gameMessage.textContent = "CONGRATULATIONS! YOU WIN!";
            gameMessage.style.color = "green";
            playSound('click-sound'); // Play a win sound
        } else {
            gameMessage.textContent = "GAME OVER";
            gameMessage.style.color = "red";
            playSound('error-sound'); // Play a lose sound
        }
    }
}

// Keyboard event handlers
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        brickBreakerState.rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        brickBreakerState.leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        brickBreakerState.rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        brickBreakerState.leftPressed = false;
    }
}

// Mouse movement handler for paddle control
function mouseMoveHandler(e) {
    const relativeX = e.clientX - brickBreakerState.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < brickBreakerState.canvas.width) {
        brickBreakerState.paddleX = relativeX - brickBreakerState.paddleWidth / 2;
        
        // Keep paddle within canvas bounds
        if (brickBreakerState.paddleX < 0) {
            brickBreakerState.paddleX = 0;
        } else if (brickBreakerState.paddleX > brickBreakerState.canvas.width - brickBreakerState.paddleWidth) {
            brickBreakerState.paddleX = brickBreakerState.canvas.width - brickBreakerState.paddleWidth;
        }
    }
}

// Cleanup function to remove event listeners when window is closed
function cleanupBrickBreaker() {
    document.removeEventListener('keydown', keyDownHandler);
    document.removeEventListener('keyup', keyUpHandler);
    
    if (brickBreakerState.gameInterval) {
        clearInterval(brickBreakerState.gameInterval);
        brickBreakerState.gameInterval = null;
    }
}