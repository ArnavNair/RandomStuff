// Main game logic implemented in JavaScript

// Global variables
var canvas, canvasContext; // Canvas control
var interval; // Variable to contain the main game interval function
var FPS = 46; // Maintain FPS of the game at desired value
var ballX = 0, ballY = 0; // Ball position
var ballSpeedX = 9, ballSpeedY = 4; // Ball speed
var paddle1Y = 0, paddle2Y = 0; // Player paddle position
const PADDLE_WIDTH = 5; // Paddle width
const PADDLE_HEIGHT = 80; // Paddle height
var playerScore = 0, computerScore = 0; //Score variables
const WINNING_SCORE = 5; // Score needed to win
var messageScreen = true; // Keep track of whether we're on the winning screen or not

// Start or restart the game
function startGame() {
    interval = setInterval(function() {
        drawBG();
        drawLine();
        drawPaddles();
        moveBall();
        moveComputer();
        displayScore();
    }, 1000/FPS);
}

// Function to accept and relay mouse position for the player's paddle
function calculateMousePos(event) {
    var rect = canvas.getBoundingClientRect(); // Canvas dimensions
    var root = document.documentElement; // Main document element

    // Get the effective mouse co-ordinates within the canvas, accounting for scrolling within the window
    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;

    // Return the effective mouse co-ordinates
    return {
        x: mouseX,
        y: mouseY
    };
}


// Function to set the background for the canvas
function drawBG() {
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

// Function to draw the dividing line
function drawLine() {
    canvasContext.fillStyle = "white";
    var lineY = 0;
    while(lineY <= canvas.height)
    {
        canvasContext.fillRect(lineX, lineY, 2, 15);
        lineY += 30;
    }
}

// Function to move the ball
function moveBall() {
    // Draw the ball
    canvasContext.fillStyle = "white";
    canvasContext.beginPath();
    canvasContext.arc(ballX, ballY, 6.5, 0, Math.PI * 2, true);
    canvasContext.fill();

    // Enforce bouncing off the paddles and reset for border-collision
    if(ballX < 0)
    {
        if(ballY >= paddle1Y && ballY <= paddle1Y + PADDLE_HEIGHT){
            ballSpeedX = - ballSpeedX;

            // Enable ball control to change ball speed based on point of contact with the paddle
            var deltaY = ballY - (paddle1Y + (PADDLE_HEIGHT / 2));
            ballSpeedY = deltaY * 0.3;
        }
        else{
            ++computerScore;

            // Check if computer has won
            if(computerScore >= WINNING_SCORE)
                gameReset("Oops! The computer has won.");

            // If game is still on-going, reset the ball and continue
            ballReset();
        }
    }
    if(ballX > canvas.width)
    {
        if(ballY >= paddle2Y && ballY <= paddle2Y + PADDLE_HEIGHT){
            ballSpeedX = - ballSpeedX;

            // Enable ball control to change ball speed based on point of contact with the paddle
            var deltaY = ballY - (paddle2Y + (PADDLE_HEIGHT / 2));
            ballSpeedY = deltaY * 0.3;
        }
        else{
            ++playerScore;

            // Check if player has won
            if(playerScore >= WINNING_SCORE)
                gameReset("Congrats! You have won.");

            // If game is still on-going, reset the ball and continue
            ballReset();
        }
    }
    if(ballY <= 1 || ballY >= canvas.height - 1)
        ballSpeedY = - ballSpeedY;

    // Update the ball's position
    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

// Function to display the paddles
function drawPaddles() {
    canvasContext.fillRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    canvasContext.fillRect(canvas.width - 5, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

// Function to reset the ball if it touches the side walls
function ballReset() {
    // Bring the ball back to the centre and update its speeds to random values
    ballX = canvas.width / 2;
    ballSpeedX = 0;
    while(ballSpeedX < 5)
        ballSpeedX = Math.random() * 10;

    ballY = canvas.height / 2;
    ballSpeedY = 0;
    while(ballSpeedY < 5)
        ballSpeedY = Math.random() * 10;

    // Ensure the effective game speed never gets too slow
    if(ballSpeedX < 7 && ballSpeedY < 7)
        FPS = 50;
    else
        FPS = 46;
}

// Function to bring the computer paddle to life
function moveComputer() {
    var paddle2YCentre = paddle2Y + (PADDLE_HEIGHT / 2);

    // Move the computer paddle
    if(ballSpeedX > 0){
        if(paddle2YCentre < (ballY - 30))
            paddle2Y += 8;
        else if(paddle2YCentre > (ballY + 30))
            paddle2Y -= 8;
    }
}

// Display the current score
function displayScore() {
    canvasContext.fillText("Your Score: " + playerScore, 270, 80);
    canvasContext.fillText("Computer Score: " + computerScore, canvas.width - 470, 80);
}

// Function to reset the game if either player wins
function gameReset(winningMessage) {
    // Reset scores
    playerScore = 0;
    computerScore = 0;
    messageScreen = true;

    // Show the Winning screen
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    drawBG();
    canvasContext.fillStyle = "white";
    canvasContext.fillText(winningMessage, (canvas.width / 2) - 150, (canvas.height / 2) - 50);
    canvasContext.fillText("Click to restart the game.", (canvas.width / 2) - 150, (canvas.height / 2));
    clearInterval(interval);
}

// Render the game
window.onload = function() {
    // Obtain the canvas object from the DOM to create the basic game background
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    // Default settings
    lineX = canvas.width / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    paddle1Y = canvas.height / 2;
    paddle2Y = canvas.height / 2;
    canvasContext.font = "25px Arial";

    // Begin the game
    drawBG();
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Welcome to Arcade Tennis!", (canvas.width / 2) - 180, (canvas.height / 2) - 50);
    canvasContext.fillText("Click to begin.", (canvas.width / 2) - 108, (canvas.height / 2));

    // Add an event listener for mouse movement to control the player's paddle
    canvas.addEventListener("mousemove", function(event) {
        var mousePos = calculateMousePos(event);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2); //Ensures that mouse movement is in-sync with the centre of the paddle instead of the top
    })

    // Add an event listener for mouse click to start or restart the game
    canvas.addEventListener("mousedown", function(event){
        if(messageScreen){
            messageScreen = false;
            startGame();
        }
    })
}
