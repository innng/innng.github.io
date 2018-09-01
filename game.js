var canvas;                 // info about dimensions of the display area
var canvasContext;          // gaphical info used to draw forms

var xBall = 50;             // ball's position in x-axis
var xBallSpeed = 10;        // ball's speed in the x-axis
var yBall = 50;            // ball's position in y-axis
var yBallSpeed = 4;        // ball's speed in the y-axis

var yLeftPaddle = 250;      // left paddle's position in y-axis
var yRightPaddle = 250;     // right paddle's position in y-axis

var player1Score = 0;       // total of points for player
var player2Score = 0;       // total of points for pc

var endGame = false;        // flag to indicating end of the game

const RADIUS_BALL = 10;     // ball's radius
const WIDTH_PADDLE = 10;    // paddles' width
const HEIGHT_PADDLE = 100;  // paddles' height
const PADDLE_BORDER = 0;    // distance between canvas border and the paddles
const WINNING_SCORE = 3;   // biggest score one player can achieve

// let the HTML page load before running js code
window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    // set the ball's movement
    var frameRate = 1000/30;
    setInterval(function() { move(); draw(); }, frameRate);

    canvas.addEventListener('mousedown', handleMouseClick);

    // call function if the event 'mousemove' happens
    canvas.addEventListener('mousemove', function(evt) {
        var pos = mousePos(evt);
        yLeftPaddle = pos.y - (HEIGHT_PADDLE/2);
    });
}

// moves the elements in the canvas
function move() {
    if(endGame)
        return;

    pcMovement();

    xBall += xBallSpeed;    // moves the ball in the x-axis
    yBall += yBallSpeed;    // moves the ball in the y-axis

    // test x-axis limits
    if(xBall < 0)
        if(yBall > yLeftPaddle && yBall < yLeftPaddle + HEIGHT_PADDLE) {
            xBallSpeed = -xBallSpeed;

            // calculates the angle for hitting the ball
            var delta = yBall - (yLeftPaddle + HEIGHT_PADDLE/2);
            yBallSpeed = delta * 0.35;
        }
        else {
            player2Score++;
            resetBall();
        }

    if(xBall > canvas.width)
        if(yBall > yRightPaddle && yBall < yRightPaddle + HEIGHT_PADDLE) {
            xBallSpeed = -xBallSpeed;

            // calculates the angle for hitting the ball
            var delta = yBall - (yRightPaddle + HEIGHT_PADDLE/2);
            yBallSpeed = delta * 0.35;
        }
        else {
            player1Score++;
            resetBall();
        }

    // test y-axis limits
    if(yBall < 0 || yBall > canvas.height)
        yBallSpeed = -yBallSpeed;
}

// draws every element
function draw() {
    const X_RIGHT_PADDLE = canvas.width - PADDLE_BORDER - WIDTH_PADDLE;
    // canvasContext.font = '20px Calibri';

    // background
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if(endGame) {
        gameOverMenu();
        return;
    }

    // net
    drawNet();

    // left paddle
    colorRect(PADDLE_BORDER, yLeftPaddle, WIDTH_PADDLE, HEIGHT_PADDLE, 'white');
    // right paddle
    colorRect(X_RIGHT_PADDLE, yRightPaddle, WIDTH_PADDLE, HEIGHT_PADDLE, 'white');
    // ball
    colorCircle(xBall, yBall, RADIUS_BALL, 'white');
    // scores
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

// creates a colored rectangle
function colorRect(xLeft, yTop, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(xLeft, yTop, width, height);
}

// creates a colored circle
function colorCircle(x, y, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

// captures mouse's movement, evt: receives mouse's coordinates
function mousePos(evt) {
    // area of the canvas
    var rect = canvas.getBoundingClientRect();
    // handle on the HTML page
    var root = document.documentElement;
    // getting the relative mouse's position based on the canvas and the scroll
    var xMouse = evt.clientX - rect.left - root.scrollLeft;
    var yMouse = evt.clientY - rect.top - root.scrollTop;

    return {
            x: xMouse, y: yMouse
    };
}

function resetBall() {
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE)
        endGame = true;

    xBallSpeed = -xBallSpeed;
    xBall = canvas.width/2;
    yBall = canvas.height/2;
}

function pcMovement() {
    var yRightPaddleCenter = yRightPaddle + (HEIGHT_PADDLE/2)
    if(yRightPaddleCenter < yBall - 30)
        yRightPaddle += 6;
    else if(yRightPaddleCenter > yBall + 30)
        yRightPaddle -= 6;
}

function gameOverMenu() {
    // canvasContext.font = '60px Calibri';
    canvasContext.fillStyle = 'white';

    if(player1Score >= WINNING_SCORE)
        canvasContext.fillText("Player won!", 350, 200);
    else if(player2Score >= WINNING_SCORE)
        canvasContext.fillText("Computer won!", 350, 200);

    canvasContext.fillText("Click to continue", 350, 500);
}

function handleMouseClick(evt) {
    if(endGame) {
        player1Score = 0;
        player2Score = 0;
        endGame = false;
    }
}

function drawNet() {
    for(var i = 0; i < canvas.height; i += 40)
        colorRect(canvas.width/2 -1, i, 2, 20, 'white');
}
