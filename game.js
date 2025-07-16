// --- Game Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const startButton = document.getElementById('startButton');

canvas.width = 600; // You can adjust these
canvas.height = 400; // You can adjust these

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    color: 'yellow',
    speed: 5
};

let enemy = {
    x: 0,
    y: 0,
    size: 25, // Red square size
    color: 'red',
    speed: 2 // Base speed for the enemy
};

let collectible = {
    x: 0,
    y: 0,
    size: 20, // Green square size
    color: 'limegreen'
};

let score = 0;
let level = 1;
const scorePerLevel = 100; // Points needed to level up
const maxLevel = 500; // Maximum level

let gameRunning = false;
let animationFrameId; // To control the game loop

// --- Sound Variables ---
// MAKE SURE THESE PATHS ARE CORRECT! (relative to game.js)
const gameOverSound = new Audio('./sounds/433644_dersuperanton_game_over_sound.wav');
const collectSound = new Audio('./sounds/658431_deathbyfairydust_pop.wav');
const backgroundMusic = new Audio('./sounds/165046_setuniman_silly-tune-0o_44m.wav');
const gameStartSound = new Audio('./sounds/446142_justinvoke_race_start.wav');
const levelUpSound = new Audio('./sounds/433701_dersuperanton_level_up_voice.wav');

// Loop background music and set its volume
backgroundMusic.loop = true;
backgroundMusic.volume = 0.4; // Adjust volume (0.0 to 1.0) as needed

// --- Game Functions ---

function resetGame() {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    score = 0;
    level = 1;
    enemy.speed = 2; // Reset enemy speed to base
    updateScoreDisplay();
    updateLevelDisplay();
    placeCollectible(); // Place the first collectible
    placeEnemy();       // Place the first enemy
}

function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

function updateLevelDisplay() {
    levelDisplay.textContent = level;
}

function placeCollectible() {
    collectible.x = Math.random() * (canvas.width - collectible.size);
    collectible.y = Math.random() * (canvas.height - collectible.size);
}

function placeEnemy() {
    // Place enemy randomly, ensuring it's not too close to player initially
    let spawnX, spawnY;
    do {
        spawnX = Math.random() * (canvas.width - enemy.size);
        spawnY = Math.random() * (canvas.height - enemy.size);
    } while (getDistance(player.x, player.y, spawnX + enemy.size / 2, spawnY + enemy.size / 2) < 150); // Ensure initial distance
    enemy.x = spawnX;
    enemy.y = spawnY;
}


function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function drawEnemy() {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
}

function drawCollectible() {
    ctx.fillStyle = collectible.color;
    ctx.fillRect(collectible.x, collectible.y, collectible.size, collectible.size);
}

function getDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

function checkCollectibleCollision() {
    const dist = getDistance(player.x, player.y, collectible.x + collectible.size / 2, collectible.y + collectible.size / 2);
    if (dist < player.radius + collectible.size / 2) {
        score += 10; // Increase score for collecting
        collectSound.currentTime = 0;
        collectSound.play();
        updateScoreDisplay();
        placeCollectible(); // Place a new collectible

        // Check for level up
        if (score >= level * scorePerLevel && level < maxLevel) {
            level++;
            levelUpSound.currentTime = 0;
            levelUpSound.play();
            updateLevelDisplay();
            enemy.speed += 0.2; // Increase enemy speed slightly per level
            // You can add more difficulty increases here, e.g., make collectible smaller, add more enemies, etc.
        }
    }
}

function checkEnemyCollision() {
    const playerCenterX = player.x;
    const playerCenterY = player.y;
    const enemyCenterX = enemy.x + enemy.size / 2;
    const enemyCenterY = enemy.y + enemy.size / 2;

    const dist = getDistance(playerCenterX, playerCenterY, enemyCenterX, enemyCenterY);

    if (dist < player.radius + enemy.size / 2) {
        gameOver(); // Game over if enemy touches player
    }
}

function updateEnemyPosition() {
    // Enemy chases the player
    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
    enemy.x += Math.cos(angle) * enemy.speed;
    enemy.y += Math.sin(angle) * enemy.speed;

    // Keep enemy within canvas bounds
    if (enemy.x < 0) enemy.x = 0;
    if (enemy.x > canvas.width - enemy.size) enemy.x = canvas.width - enemy.size;
    if (enemy.y < 0) enemy.y = 0;
    if (enemy.y > canvas.height - enemy.size) enemy.y = canvas.height - enemy.size;
}

// --- Game Loop ---
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    updateEnemyPosition();
    checkCollectibleCollision();
    checkEnemyCollision();

    drawCollectible();
    drawEnemy();
    drawPlayer();

    animationFrameId = requestAnimationFrame(gameLoop); // Continue the loop
}

function startGame() {
    if (gameRunning) return; // Prevent multiple starts

    gameRunning = true;
    startButton.style.display = 'none'; // Hide start button
    resetGame(); // Reset game state
    gameLoop(); // Start the game loop

    // --- Sound Integration for Game Start ---
    gameStartSound.currentTime = 0;
    gameStartSound.play();

    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId); // Stop the game loop
    startButton.textContent = 'Play Again';
    startButton.style.display = 'block'; // Show start button again

    // --- Sound Integration for Game Over ---
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Reset for next game
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    alert(`Game Over, Alfie! Your Score: ${score} | Level Reached: ${level}`);
}

// --- Event Listeners ---
startButton.addEventListener('click', startGame);

// Basic Keyboard Controls for Player Movement
// You might need to adjust these based on your preference or device capabilities
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            player.y -= player.speed;
            break;
        case 'ArrowDown':
        case 's':
            player.y += player.speed;
            break;
        case 'ArrowLeft':
        case 'a':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
        case 'd':
            player.x += player.speed;
            break;
    }

    // Keep player within canvas bounds
    if (player.x < player.radius) player.x = player.radius;
    if (player.x > canvas.width - player.radius) player.x = canvas.width - player.radius;
    if (player.y < player.radius) player.y = player.radius;
    if (player.y > canvas.height - player.radius) player.y = canvas.height - player.radius;
});

// Initial setup
resetGame(); // Sets initial score/level/positions
startButton.style.display = 'block'; // Ensure button is visible initially
