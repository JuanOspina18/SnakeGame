import './style.css'

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const BLOCK_SIZE = 30;
const BOARD_WIDTH = 21;
const BOARD_HEIGHT = 21;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;
context.scale(BLOCK_SIZE, BLOCK_SIZE);


//CREATE ARRAY IN CANVA
const board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(1));


//piece= snake
let piece = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

let direction = { x: 1, y: 0 };
let move = false;

const apple = {
  position: randomPositionApple(),
  shape: [[1]],
};

let dropCounter = 0;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;

  if (dropCounter > 250 && move) {
    const newHead = {
      x: piece[0].x + direction.x,
      y: piece[0].y + direction.y
    };
    piece.unshift(newHead);
    piece.pop();

    if (collision() || collisionSnake()) {
      piece = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ];
      direction = { x: 1, y: 0 };
      move = false;
      apple.position = randomPositionApple();
      GameOver();
    }

    if (collisionApple()) {
      growSnake();
      apple.position = randomPositionApple();
    }

    dropCounter = 0;
  }

  draw();
  window.requestAnimationFrame(update);
}


//GROWTH OF SNAKE
function growSnake() {
  const newSegment = { ...piece[piece.length - 1] };
  piece.push(newSegment);
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = '#b2ff33';
        context.fillRect(x, y, 1, 1);
      }
    });
  });

  context.strokeStyle = '#000000';
  context.lineWidth = 0.03;

  //LINES ARRAY DRAWING
  for (let x = 0; x <= BOARD_WIDTH; x++) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, BOARD_HEIGHT);
    context.stroke();
  }

  for (let y = 0; y <= BOARD_HEIGHT; y++) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(BOARD_WIDTH, y);
    context.stroke();
  }

  // SNAKE DRAWING
  context.fillStyle = 'blue';
  piece.forEach(segment => {
    context.fillRect(segment.x, segment.y, 1, 1);
  });

  // APPLE DRAWING
  apple.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'red';
        context.fillRect(x + apple.position.x, y + apple.position.y, 1, 1);
      }
    });
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && direction.x !== 1) {
    direction = { x: -1, y: 0 };
    move = true;
  }
  if (event.key === 'ArrowRight' && direction.x !== -1) {
    direction = { x: 1, y: 0 };
    move = true;
  }
  if (event.key === 'ArrowDown' && direction.y !== -1) {
    direction = { x: 0, y: 1 };
    move = true;
  }
  if (event.key === 'ArrowUp' && direction.y !== 1) {
    direction = { x: 0, y: -1 };
    move = true;
  }
});


//COLLISION WITH THE LIMITS CANVA
function collision() {
  return (
    board[piece[0].y]?.[piece[0].x] !== 1 ||
    piece[0].y < 0 ||
    piece[0].y >= BOARD_HEIGHT ||
    piece[0].x < 0 ||
    piece[0].x >= BOARD_WIDTH
  );
}


//RANDOM POSITION OF APPLE
function randomPositionApple() {
  const x = Math.floor(Math.random() * BOARD_WIDTH);
  const y = Math.floor(Math.random() * BOARD_HEIGHT);
  return { x, y };
}


//COLLISION APPLE WITH SNAKE
function collisionApple() {
  return piece[0].x === apple.position.x && piece[0].y === apple.position.y;
}


//COLLISION SNAKE WITH SELF
function collisionSnake(){
  let collision = false;

  piece.slice(1).forEach(segment => {
    if (segment.x === piece[0].x && segment.y === piece[0].y) {
      collision = true;
    }
  });

  return collision;

}



//SCREEN START
const $section= document.querySelector('section')
$section.addEventListener('click',()=>{
  update()
  $section.remove()
})


//Screen Game Over

function GameOver() {
  const gameOver = document.createElement('div');
  gameOver.className = 'gameOverCss';

  const text = document.createTextNode('GAME OVER');
  const restartText = document.createTextNode('Haz clic para reiniciar');

  gameOver.appendChild(text);
  gameOver.appendChild(document.createElement('br'));
  gameOver.appendChild(restartText);

  document.body.appendChild(gameOver);

  gameOver.style.display = 'block';

  document.addEventListener('click', ()=>{
    update()
    gameOver.remove()
  });
  
}
