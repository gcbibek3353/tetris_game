const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));

const score = document.getElementById("score")
const startBtn = document.getElementById("start-button");
const btnImg = document.getElementById("btnImg")
const width = 10;
var count = 0;
var gOver = false;

// Arrow Buttons
const leftBtn = document.getElementById("left");
const downBtn = document.getElementById("down");
const rightBtn = document.getElementById("right");
const rotateBtn = document.getElementById("rotate");

// colors 
const color = [
    "#A03EFF",
    "#FF3353",
    "#FFE833",
    "#33FFD1",
    "#15e915"
]


// // Rough code 
// for (i = 0; i < 200; i++) {
//     squares[i].textContent = i;
// }

// shapes 
const lshape = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
]


const zshape = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width + 1, width, width * 2]
]

const tshape = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
]

const oshape = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]

const ishape = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
]

// ishape[3].forEach(index=>{
//     squares[index].style.background = "red"
// })

const theShapes = [lshape, zshape, tshape, oshape, ishape];

let currentPosition = 4;
let currentRotation = 0;


// // Selecting random shape 
let random = Math.floor(Math.random() * theShapes.length);
let currentShape = theShapes[random][currentRotation]


// // draw the shapes 
function draw() {
    currentShape.forEach((index) => {
        squares[currentPosition + index].style.background = color[random];
    })
}
draw();

// // Erase the shape 
function erase() {
    currentShape.forEach((index) => {
        squares[currentPosition + index].style.background = "none";
    })
}
// // move down 
function moveDown() {
    erase();
    currentPosition += width;
    draw();
    stop();
}
var timer = setInterval(moveDown, 1000);

// // stop the shape 
function stop() {
    if (currentShape.some(index => squares[currentPosition + index + width].classList.contains('freeze'))) {
        currentShape.forEach(index => squares[currentPosition + index].classList.add('freeze'));
        // start a new shape 
        random = Math.floor(Math.random() * theShapes.length);
        currentRotation = 0;
        currentShape = theShapes[random][currentRotation]
        currentPosition = 4;
        draw();
        gameOver();
        addScore();
    }
}

// // control the game 
function control(e) {
    if (!gOver) {
        if (e.keyCode === 37) {
            moveleft();
        }
        else if (e.keyCode === 39) {
            moveRight();
        }
        else if (e.keyCode === 40) {
            moveDown();
        }
        else if (e.keyCode === 38) {
            rotate();
        }
    }
}
    window.addEventListener("keydown", control);

// // Control shapes in phone 
leftBtn.addEventListener("click", moveleft);
rightBtn.addEventListener("click", moveRight);
downBtn.addEventListener("click", moveDown);
rotateBtn.addEventListener("click", rotate);

// // move left 
function moveleft() {
    erase();
    let leftBlockage = currentShape.some(index => (currentPosition + index) % width === 0)
    let Blockage = currentShape.some(index => squares[currentPosition + index - 1].classList.contains('freeze'));
    if (!leftBlockage && !Blockage) {
        currentPosition--;
    }
    draw();
}

// // move right 
function moveRight() {
    erase();

    let RightBlockage = currentShape.some(index => (currentPosition + index) % width === width - 1)
    let Blockage = currentShape.some(index => squares[currentPosition + index + 1].classList.contains('freeze'));
    if (!RightBlockage && !Blockage) {
        currentPosition++;
    }
    draw();
}

// // Rotate 
function rotate() {
    erase();
    let RightBlockage = currentShape.some(index => (currentPosition + index) % width === width - 1)
    let leftBlockage = currentShape.some(index => (currentPosition + index) % width === 0)

    if (!leftBlockage && !RightBlockage) {
        currentRotation = (currentRotation + 1) % 4;
    }
    currentShape = theShapes[random][currentRotation];
    draw();
}

// // Pause Function 
function pause() {
    if (timer) {
        clearInterval(timer)
        timer = null;
        btnImg.src = "images/play.png";
    }
    else {
        draw();
        timer = setInterval(moveDown, 1000);
        btnImg.src = "images/pause.png"
    }
}
startBtn.addEventListener("click", pause);

// // game over 
function gameOver() {
    if (currentShape.some(index => squares[currentPosition + index].classList.contains('freeze'))) {
        score.innerHTML = "Game Over";
        clearInterval(timer);
        pause();
        gOver = true;
    }
}

// // add score
function addScore() {
    for (let i = 0; i<199; i += width) {
        const row = [i,i+1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        // console.log(row);
        if (row.every(index => squares[index].classList.contains('freeze'))) {
            count += 10;
            score.textContent = `Score : ${count}`
            row.forEach(index => {
                squares[index].classList.remove("freeze");
                squares[index].style.background = '';
            })
            const squareRemoved = squares.splice(i,width);
            console.log(squareRemoved);  
            squares = squareRemoved.concat(squares)
            squares.forEach(square => grid.appendChild(square));
        }
    }
}