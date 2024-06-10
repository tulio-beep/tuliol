const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Defina o tamanho do canvas
const canvasWidth = (canvas.width = window.innerWidth);
const canvasHeight = (canvas.height = window.innerHeight * 0.8);

// Defina o tamanho do bloco
const blockSize = 20;
const columns = Math.floor(canvasWidth / blockSize);
const rows = Math.floor(canvasHeight / blockSize);

// Desenha a grade para visualização
function drawGrid() {
  ctx.strokeStyle = '#bbb';  // Cor das linhas da grade
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
    }
  }
}

// Função para acessar um bloco específico na matriz e desenhar algo nele
function drawBlock(col, row, color) {
  const x = col * blockSize;
  const y = row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
}

function clearBlock(col, row) {
  const x = col * blockSize;
  const y = row * blockSize;
  ctx.clearRect(x, y, blockSize, blockSize);
}

ctx.fillStyle = 'white';
ctx.font = '24px Quicksand';
ctx.textAlign = 'center';
ctx.fillText('Pressione WASD ou Toque para iniciar.', canvasWidth / 2, canvasHeight / 2);

// Cor da Cobra
const s_color = 'white';

// Cor da Comida
const f_color = 'red';

let direction_;
let direction;
let gameLoop = null;
let gameStarted = false;

// Listener de teclado
document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();

  if (!gameStarted && ['w', 'a', 's', 'd'].includes(key)) {
    start();
    gameStarted = true;
  }

  if (['w', 'a', 's', 'd'].includes(key)) {
    direction_ = key === 'w' && direction !== 'baixo' ? 'cima' :
      key === 's' && direction !== 'cima' ? 'baixo' :
      key === 'a' && direction !== 'direita' ? 'esquerda' :
      key === 'd' && direction !== 'esquerda' ? 'direita' : direction;
  }
});

// Função de atualização
function update() {
  // Move a cabeça da cobra
  direction = direction_;
  snake.body.push({ x: snake.head.x, y: snake.head.y });
  switch (direction) {
    case 'esquerda':
      snake.head.x--;
      break;
    case 'direita':
      snake.head.x++;
      break;
    case 'cima':
      snake.head.y--;
      break;
    case 'baixo':
      snake.head.y++;
      break;
  }

  drawBlock(snake.head.x, snake.head.y, s_color);

  // Se a cobra bater nas paredes
  if (snake.head.x >= columns || snake.head.x < 0 ||
    snake.head.y >= rows || snake.head.y < 0) {
    gameOver();
    return; // Fim do jogo
  }

  // Se a cabeça está na mesma posição que o corpo
  for (let i = 0; i < snake.body.length; i++) {
    if (snake.head.x === snake.body[i].x && snake.head.y === snake.body[i].y) {
      gameOver();
      return; // Fim do jogo
    }
  }

  // Se a cobra comer a comida
  if (snake.head.x === food.x && snake.head.y === food.y) {
    // A cobra cresce
    // Gera uma nova posição para a comida
    snake.size++;
    food = {
      x: parseInt(Math.random() * columns),
      y: parseInt(Math.random() * rows)
    };

    while (verifyBody()) {
      food = {
        x: parseInt(Math.random() * columns),
        y: parseInt(Math.random() * rows)
      };
    }

    function verifyBody() {
      let answer = false;
      for (let i = 0; i < snake.body.length; i++) {
        if (food.x === snake.body[i].x && food.y === snake.body[i].y) {
          answer = true;
        }
      }
      return answer;
    }

    drawBlock(food.x, food.y, f_color);

  } else {
    // Se não, remove o bloco da cauda
    let tail = snake.body.shift();
    clearBlock(tail.x, tail.y);
  }
}

// Loop principal do jogo
function start() {
  // Posição inicial da cobra
  let x_ = parseInt(Math.random() * columns);
  let y_ = parseInt(Math.random() * rows);
  snake = {
    head: { x: x_, y: y_ },
    body: [],
    size: 1
  };

  // Posição inicial da comida
  food = {
    x: parseInt(Math.random() * columns),
    y: parseInt(Math.random() * rows)
  };

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBlock(food.x, food.y, f_color);
  if (!gameLoop) {
    gameLoop = setInterval(update, 70);
  }
}

function gameOver() {
  clearInterval(gameLoop);
  gameLoop = null;
  ctx.fillStyle = 'white';
  ctx.font = '24px Quicksand';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvasWidth / 2, canvasHeight / 2);
  gameStarted = false;
}

canvas.addEventListener('touchstart', handleTouch, false);
const rect = canvas.getBoundingClientRect();
const x_ref = rect.width / 3;
const y_ref = rect.height / 3;

function handleTouch(event) {
  event.preventDefault();
  const touch = event.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  
  if (!gameStarted) {
    gameStarted = true;
    start();
  }

  if ((x > x_ref && x < x_ref * 2) && (y > y_ref * 2) && direction !== "cima") {
    direction_ = "baixo";
  } else if ((x > x_ref && x < x_ref * 2) && (y < y_ref) && direction !== "baixo") {
    direction_ = "cima";
  } else if ((y > y_ref && y < y_ref * 2) && (x < x_ref) && direction !== "direita") {
    direction_ = "esquerda";
  } else if ((y > y_ref && y < y_ref * 2) && (x > x_ref * 2) && direction !== "esquerda") {
    direction_ = "direita";
  }
}
