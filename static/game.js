<<<<<<< HEAD

// --- Sound Variables ---
// Make sure these paths are correct, relative to game.js!
const gameOverSound = new Audio('./sounds/433644_dersuperanton_game_over_sound.wav');
const collectSound = new Audio('./sounds/658431_deathbyfairydust_pop.wav');
const backgroundMusic = new Audio('./sounds/165046_setuniman_silly-tune-0o_44m.wav');
const gameStartSound = new Audio('./sounds/446142_justinvoke_race_start.wav');
const levelUpSound = new Audio('./sounds/433701_dersuperanton_level_up_voice.wav');

// Loop background music and set its volume (optional, but good practice)
backgroundMusic.loop = true;
backgroundMusic.volume = 0.4; // Adjust volume (0.0 to 1.0) as needed
// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let circles = []; // Blue circles
let yellowItem = null; // The yellow item to collect
let redItem = null; // The red item chasing the yellow one

const collectSound = new Audio('/static/collect.mp3');

// Function to generate a random position
function getRandomPosition() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    return { x, y };
}

// Create blue circles
function createBlueCircles(count) {
    circles = [];
    for (let i = 0; i < count; i++) {
        circles.push({
            ...getRandomPosition(),
            radius: 20,
            color: 'blue'
        });
    }
}

// Create yellow item
function createYellowItem() {
    yellowItem = {
        ...getRandomPosition(),
        radius: 15,
        color: 'yellow',
        speed: 2, // Speed at which it moves
        dx: (Math.random() - 0.5) * 2, // Random direction X
        dy: (Math.random() - 0.5) * 2  // Random direction Y
    };
}

// Create red chasing item
function createRedItem() {
    redItem = {
        ...getRandomPosition(),
        radius: 18,
        color: 'red',
        speed: 1.5 // Speed at which it chases
    };
}

// Draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw blue circles
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.closePath();
    });

    // Draw yellow item if it exists
    if (yellowItem) {
        ctx.beginPath();
        ctx.arc(yellowItem.x, yellowItem.y, yellowItem.radius, 0, Math.PI * 2);
        ctx.fillStyle = yellowItem.color;
        ctx.fill();
        ctx.closePath();
    }

    // Draw red item if it exists
    if (redItem) {
        ctx.beginPath();
        ctx.arc(redItem.x, redItem.y, redItem.radius, 0, Math.PI * 2);
        ctx.fillStyle = redItem.color;
        ctx.fill();
        ctx.closePath();
    }

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Update game logic
function update() {
    // Move yellow item
    if (yellowItem) {
        yellowItem.x += yellowItem.speed * yellowItem.dx;
        yellowItem.y += yellowItem.speed * yellowItem.dy;

        // Bounce off walls
        if (yellowItem.x + yellowItem.radius > canvas.width || yellowItem.x - yellowItem.radius < 0) {
            yellowItem.dx *= -1;
        }
        if (yellowItem.y + yellowItem.radius > canvas.height || yellowItem.y - yellowItem.radius < 0) {
            yellowItem.dy *= -1;
        }
    }

    // Move red item towards yellow item
    if (redItem && yellowItem) {
        const angle = Math.atan2(yellowItem.y - redItem.y, yellowItem.x - redItem.x);
        redItem.x += redItem.speed * Math.cos(angle);
        redItem.y += redItem.speed * Math.sin(angle);

        // Check for collision between red and yellow
        const dx = redItem.x - yellowItem.x;
        const dy = redItem.y - yellowItem.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < redItem.radius + yellowItem.radius) {
            // Red caught yellow, reset yellow and red
            score--; // Deduct score for getting caught
            createYellowItem();
            createRedItem();
=======
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State Variables
const GAME_STATE = {
    START: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};
let currentGameState; // Will be set to GAME_STATE.START on initial load

// --- Game Settings ---
const PLAYER_RADIUS = 20;
const PLAYER_MOVE_SPEED = 5;
const ITEM_SIZE = 15;
const ENEMY_SIZE = 25;
const ENEMY_SPEED = 2; // Speed of the enemies

// --- Colors ---
const PLAYER_COLOR = '#FFD700'; // Gold
const ITEM_COLOR = '#00FF00'; // Green
const ENEMY_COLOR = '#FF0000'; // Red
const TEXT_COLOR = '#FFFFFF'; // White for UI text
const BACKGROUND_COLOR = '#000000'; // Black (canvas background)

// --- Player Variables ---
let playerX; // Initialized in resetGame
let playerY; // Initialized in resetGame

// --- Touch Input Handling ---
let touchTargetX; // Initialized in resetGame
let touchTargetY; // Initialized in resetGame

canvas.addEventListener('touchmove', function(event) {
    if (currentGameState === GAME_STATE.PLAYING) {
        event.preventDefault(); // Prevent scrolling on mobile
        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        touchTargetX = touch.clientX - rect.left;
        touchTargetY = touch.clientY - rect.top;
    }
}, false);

canvas.addEventListener('touchstart', function(event) {
    if (currentGameState === GAME_STATE.START || currentGameState === GAME_STATE.GAME_OVER) {
        event.preventDefault();
        resetGame(); // Reset and start playing
    }
}, false);

// --- Game Objects ---
let score; // Initialized in resetGame
let items = []; // Array to hold multiple collectable items
let enemies = []; // Array to hold multiple enemies

// --- Functions to Draw Game Elements ---

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(playerX, playerY, PLAYER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fill();
    ctx.closePath();
}

function drawItem(item) {
    ctx.fillStyle = ITEM_COLOR;
    ctx.fillRect(item.x - ITEM_SIZE / 2, item.y - ITEM_SIZE / 2, ITEM_SIZE, ITEM_SIZE);
}

function drawEnemy(enemy) {
    ctx.fillStyle = ENEMY_COLOR;
    ctx.fillRect(enemy.x - ENEMY_SIZE / 2, enemy.y - ENEMY_SIZE / 2, ENEMY_SIZE, ENEMY_SIZE);
}

function drawScore() {
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 30);
}

// --- Game State Update Functions ---

function updatePlayerMovement() {
    const deltaX = touchTargetX - playerX;
    const deltaY = touchTargetY - playerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 1) { // Move only if not very close to target
        playerX += (deltaX / distance) * PLAYER_MOVE_SPEED;
        playerY += (deltaY / distance) * PLAYER_MOVE_SPEED;
    }

    // Keep player within canvas bounds
    if (playerX - PLAYER_RADIUS < 0) playerX = PLAYER_RADIUS;
    if (playerX + PLAYER_RADIUS > canvas.width) playerX = canvas.width - PLAYER_RADIUS;
    if (playerY - PLAYER_RADIUS < 0) playerY = PLAYER_RADIUS;
    if (playerY + PLAYER_RADIUS > canvas.height) playerY = canvas.height - PLAYER_RADIUS;
}

function updateItems() {
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        // Collision Detection: Player Circle vs Item Square
        let testX = playerX;
        let testY = playerY;

        if (playerX < item.x - ITEM_SIZE / 2) testX = item.x - ITEM_SIZE / 2;
        else if (playerX > item.x + ITEM_SIZE / 2) testX = item.x + ITEM_SIZE / 2;

        if (playerY < item.y - ITEM_SIZE / 2) testY = item.y - ITEM_SIZE / 2;
        else if (playerY > item.y + ITEM_SIZE / 2) testY = item.y + ITEM_SIZE / 2;

        const distX = playerX - testX;
        const distY = playerY - testY;
        const distance = Math.sqrt((distX * distX) + (distY * distY));

        if (distance <= PLAYER_RADIUS) {
            score += 10; // Increase score
            items.splice(i, 1); // Remove item
            spawnItem(); // Spawn a new item
            console.log("Item Collected! Score: " + score);
>>>>>>> 786565a386bed48341474bd1c072db5070e99f1f
        }
    }
}

<<<<<<< HEAD
// Event listener for clicks on blue circles
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    circles.forEach((circle, index) => {
        const dx = mouseX - circle.x;
        const dy = mouseY - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < circle.radius) {
            score++;
            collectSound.play(); // Play sound
            // Remove collected circle and create a new one
            circles.splice(index, 1);
            circles.push({
                ...getRandomPosition(),
                radius: 20,
                color: 'blue'
            });
            // After collecting 3 circles, create/reset yellow and red items
            if (score % 3 === 0) {
                createYellowItem();
                createRedItem();
            }
        }
    });
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    createBlueCircles(5); // Start with 5 blue circles
    gameLoop(); // Start the game loop
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);
=======
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        // Move enemy towards player
        const dxEnemy = playerX - enemy.x;
        const dyEnemy = playerY - enemy.y;
        const distEnemy = Math.sqrt(dxEnemy * dxEnemy + dyEnemy * dyEnemy);

        if (distEnemy > 1) {
            enemy.x += (dxEnemy / distEnemy) * ENEMY_SPEED;
            enemy.y += (dyEnemy / distEnemy) * ENEMY_SPEED;
        }

        // Collision Detection: Player Circle vs Enemy Square
        let testX = playerX;
        let testY = playerY;

        if (playerX < enemy.x - ENEMY_SIZE / 2) testX = enemy.x - ENEMY_SIZE / 2;
        else if (playerX > enemy.x + ENEMY_SIZE / 2) testX = enemy.x + ENEMY_SIZE / 2;

        if (playerY < enemy.y - ENEMY_SIZE / 2) testY = enemy.y - ENEMY_SIZE / 2;
        else if (playerY > enemy.y + ENEMY_SIZE / 2) testY = enemy.y + ENEMY_SIZE / 2;

        const distX = playerX - testX;
        const distY = playerY - testY;
        const distance = Math.sqrt((distX * distX) + (distY * distY));

        if (distance <= PLAYER_RADIUS) {
            // Game Over!
            currentGameState = GAME_STATE.GAME_OVER;
            console.log("Game Over! Score: " + score);
            break; // Exit loop if game over
        }
    }
}

// --- Spawn Functions ---

function spawnItem() {
    items.push({
        x: Math.random() * (canvas.width - ITEM_SIZE) + ITEM_SIZE / 2,
        y: Math.random() * (canvas.height - ITEM_SIZE) + ITEM_SIZE / 2
    });
}

function spawnEnemy() {
    // Spawn enemy off-screen or far away
    let side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let x, y;

    switch(side) {
        case 0: x = Math.random() * canvas.width; y = -ENEMY_SIZE; break;
        case 1: x = canvas.width + ENEMY_SIZE; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = canvas.height + ENEMY_SIZE; break;
        case 3: x = -ENEMY_SIZE; y = Math.random() * canvas.height; break;
    }

    enemies.push({ x: x, y: y });
}

// --- Game State Handling ---

function resetGame() {
    playerX = canvas.width / 2;
    playerY = canvas.height / 2;
    touchTargetX = playerX;
    touchTargetY = playerY;
    score = 0;
    items = [];
    enemies = [];
    spawnItem(); // Start with one item
    spawnEnemy(); // Start with one enemy (you can add more logic to spawn more over time)
    currentGameState = GAME_STATE.PLAYING;
}

// --- Main Game Loop ---

function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentGameState === GAME_STATE.PLAYING) {
        // Update game state
        updatePlayerMovement();
        updateItems();
        updateEnemies();

        // Draw game elements
        drawPlayer();
        items.forEach(drawItem); // Draw all items
        enemies.forEach(drawEnemy); // Draw all enemies
        drawScore();

    } else if (currentGameState === GAME_STATE.START) {
        ctx.fillStyle = TEXT_COLOR;
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Tap to Start', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '16px Arial';
        ctx.fillText('Collect green squares, avoid red!', canvas.width / 2, canvas.height / 2 + 20);

    } else if (currentGameState === GAME_STATE.GAME_OVER) {
        ctx.fillStyle = TEXT_COLOR;
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 30);
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 10);
        ctx.font = '18px Arial';
        ctx.fillText('Tap to Restart', canvas.width / 2, canvas.height / 2 + 50);
    }

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Initial setup to start on the START screen
currentGameState = GAME_STATE.START; // <--- This ensures the game starts on the "Tap to Start" screen
gameLoop(); // Start the loop for the first time

>>>>>>> 786565a386bed48341474bd1c072db5070e99f1f
