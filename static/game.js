
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
        }
    }
}

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
