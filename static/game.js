// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
let level = 1;
let circles = [];
let spawnInterval = 1000; // Milliseconds
let gameRunning = false;
let lastSpawnTime = 0;
let targetHitCount = 0;
let levelUpThreshold = 5; // Hit 5 targets to level up

// Circle properties
const circleRadius = 20;
const circleSpeed = 2; // Pixels per frame
const circleColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF']; // Red, Green, Blue, Yellow, Cyan

// Game info elements
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const startButton = document.getElementById('startButton');

// Function to initialize the game
function initGame() {
    score = 0;
    level = 1;
    circles = [];
    spawnInterval = 1000;
    gameRunning = true;
    lastSpawnTime = Date.now();
    targetHitCount = 0;
    scoreElement.textContent = score;
    levelElement.textContent = level;
    startButton.style.display = 'none'; // Hide start button
    gameLoop(); // Start the game loop
}

// Main game loop
function gameLoop() {
    if (!gameRunning) {
        return;
    }

    update();
    draw();
    requestAnimationFrame(gameLoop); // Continue the loop
}

// Update game state
function update() {
    // Spawn new circles
    const now = Date.now();
    if (now - lastSpawnTime > spawnInterval) {
        createCircle();
        lastSpawnTime = now;
    }

    // Move circles
    for (let i = circles.length - 1; i >= 0; i--) {
        circles[i].y += circles[i].speed;

        // Remove circles that go off-screen
        if (circles[i].y - circles[i].radius > canvas.height) {
            circles.splice(i, 1);
            // Optionally: penalize score for missed circles
        }
    }
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circles
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.closePath();
    });
}

// Create a new circle
function createCircle() {
    const x = Math.random() * (canvas.width - circleRadius * 2) + circleRadius;
    const color = circleColors[Math.floor(Math.random() * circleColors.length)];
    circles.push({
        x: x,
        y: -circleRadius, // Start above the canvas
        radius: circleRadius,
        speed: circleSpeed + (level - 1) * 0.5, // Speed increases with level
        color: color
    });
}

// Handle click/tap events
canvas.addEventListener('click', (event) => {
    if (!gameRunning) {
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        const distance = Math.sqrt(
            Math.pow(clickX - circle.x, 2) + Math.pow(clickY - circle.y, 2)
        );

        if (distance < circle.radius) {
            // Circle hit!
            circles.splice(i, 1); // Remove the hit circle
            score += 10;
            targetHitCount++;
            scoreElement.textContent = score;

            // Check for level up
            if (targetHitCount >= levelUpThreshold) {
                level++;
                levelUpThreshold += 5; // Increase threshold for next level
                spawnInterval = Math.max(200, spawnInterval - 100); // Speed up spawning, but not below 200ms
                levelElement.textContent = level;
                // Optionally add a visual level up indicator
            }
            break; // Only hit one circle per click
        }
    }
});

// Start button event listener
startButton.addEventListener('click', initGame);

// Initial draw to show the canvas before starting
draw();
