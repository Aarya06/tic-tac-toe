const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let board = Array(9).fill(null);
let xIsNext = true;
let gameOver = false;

let disappearingMode = true;

const modeSwitch = document.getElementById("modeSwitch");
const modeStatus = document.getElementById("modeStatus");

modeSwitch.addEventListener("change", () => {
  disappearingMode = modeSwitch.checked;
  modeStatus.textContent = disappearingMode ? "ON" : "OFF";
});


function initBoard() {
  boardEl.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const btn = document.createElement("button");
    btn.className = "square";
    btn.dataset.index = i;
    btn.addEventListener("click", () => handleClick(i));
    boardEl.appendChild(btn);
  }
}

function handleClick(index) {
  if (board[index] || gameOver) return;

  board[index] = xIsNext ? "X" : "O";
  updateBoard();

  const winner = calculateWinner(board);
  if (winner) {
    statusEl.textContent = `🎉 Winner: ${winner}`;
    gameOver = true;
    return;
  }

  // Remove a random symbol ONLY if mode is ON and 6+ symbols placed
  if (disappearingMode && board.filter(Boolean).length >= 6) {
    const nextPlayer = xIsNext ? "O" : "X";
    removeRandomSymbol(nextPlayer);
  }

  xIsNext = !xIsNext;

  if (board.filter(Boolean).length === 9) {
    statusEl.textContent = "It's a draw!";
    gameOver = true;
  } else {
    statusEl.textContent = `Next Player: ${xIsNext ? "X" : "O"}`;
  }

  updateBoard();
}


function removeRandomSymbol(symbol) {
  const indices = board
    .map((val, i) => (val === symbol ? i : null))
    .filter(i => i !== null);

  if (indices.length === 0) return;

  const randomIndex = indices[Math.floor(Math.random() * indices.length)];
  board[randomIndex] = null;
}

function updateBoard() {
  const buttons = boardEl.querySelectorAll(".square");
  board.forEach((val, i) => {
    const btn = buttons[i];
    btn.textContent = val || "";
    btn.classList.remove("X", "O");
    if (val) btn.classList.add(val);
  });
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function resetGame() {
  board = Array(9).fill(null);
  xIsNext = true;
  gameOver = false;
  statusEl.textContent = "Next Player: X";
  updateBoard();
}

resetBtn.addEventListener("click", resetGame);

initBoard();
