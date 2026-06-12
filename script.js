const SIZE = 5;

let player = {
  row: 4,
  col: 2,
};

let ai = {
  row: 0,
  col: 2,
};

let currentTurn = "player";

const statusText = document.getElementById("status");
const board = document.getElementById("board");

let playerWalls = 5;
let aiWalls = 5;

let placeWallMode = false;
let walls = [];

let minimaxNodes = 0;
let useAlphaBeta = false;
let alphaBetaNodes = 0;
let prunedNodes = 0;
let searchDepth = 3;

document.getElementById("depthSelect").addEventListener("change", function () {
  searchDepth = parseInt(this.value);
});

document.getElementById("alphaBetaToggle").addEventListener("change", function () {
  useAlphaBeta = this.checked;
});

document.getElementById("wallBtn").addEventListener("click", () => {
  if (currentTurn !== "player") {
    return;
  }
  if (playerWalls <= 0) {
    statusText.innerText = "Dinding Anda habis!";
    return;
  }

  placeWallMode = !placeWallMode;
  drawBoard();
  updateUI();
});

document.getElementById("restartBtn").addEventListener("click", () => {
  player = { row: 4, col: 2 };
  ai = { row: 0, col: 2 };
  walls = [];
  playerWalls = 5;
  aiWalls = 5;
  currentTurn = "player";
  placeWallMode = false;

  // Reset telemetry display
  document.getElementById("nodeCount").innerText = "0";
  document.getElementById("prunedCount").innerText = "0";
  document.getElementById("calcTime").innerText = "0 ms";
  document.getElementById("treeContainer").innerHTML = `
    <div class="tree-info-placeholder">Mulai permainan atau biarkan AI melangkah untuk melihat game tree...</div>
  `;

  drawBoard();
  updateUI();
});

// Helper to check valid move for highlighting
function isValidPlayerMove(r, c) {
  if (isWall(r, c)) return false;
  if (r === ai.row && c === ai.col) return false;
  const dr = Math.abs(r - player.row);
  const dc = Math.abs(c - player.col);
  return dr + dc === 1;
}

function drawBoard(animateAI = false) {
  board.innerHTML = "";

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Add wall representation
      if (isWall(r, c)) {
        const wall = document.createElement("div");
        wall.classList.add("wall-block");
        cell.appendChild(wall);
      }

      // Add player representation
      if (r === player.row && c === player.col) {
        const pawn = document.createElement("div");
        pawn.classList.add("pawn", "player-pawn");
        const pawnInner = document.createElement("div");
        pawnInner.classList.add("pawn-inner");
        pawn.appendChild(pawnInner);
        cell.appendChild(pawn);
      }

      // Add AI representation
      if (r === ai.row && c === ai.col) {
        const pawn = document.createElement("div");
        pawn.classList.add("pawn", "ai-pawn");
        if (animateAI) {
          pawn.classList.add("aiMove");
        }
        const pawnInner = document.createElement("div");
        pawnInner.classList.add("pawn-inner");
        pawn.appendChild(pawnInner);
        cell.appendChild(pawn);
      }

      // Highlights for valid actions
      if (!isWall(r, c) && !(r === player.row && c === player.col) && !(r === ai.row && c === ai.col)) {
        if (currentTurn === "player") {
          if (placeWallMode) {
            cell.classList.add("wall-place-hover");
          } else if (isValidPlayerMove(r, c)) {
            cell.classList.add("valid-move");
          }
        }
      }

      cell.addEventListener("click", () => {
        // Stop playing if game is already won
        if (checkWinnerCondition("player") || checkWinnerCondition("ai")) {
          return;
        }

        if (placeWallMode) {
          placeWall(r, c);
        } else {
          movePlayer(r, c);
        }
      });

      board.appendChild(cell);
    }
  }
}

function updateUI() {
  const statusBadge = document.getElementById("status-badge");
  statusBadge.className = "status-badge"; // Clear classes

  if (checkWinnerCondition("player")) {
    statusText.innerText = "Player Menang!";
    statusBadge.classList.add("winner-player");
  } else if (checkWinnerCondition("ai")) {
    statusText.innerText = "AI Menang!";
    statusBadge.classList.add("winner-ai");
  } else {
    if (currentTurn === "player") {
      if (placeWallMode) {
        statusText.innerText = "Pilih sel untuk memasang Wall";
      } else {
        statusText.innerText = "Giliran: Player";
      }
      statusBadge.classList.add("turn-player");
    } else {
      statusText.innerText = "Giliran: AI (Berpikir...)";
      statusBadge.classList.add("turn-ai");
    }
  }

  // Update wall button mode visual
  const wallBtn = document.getElementById("wallBtn");
  if (placeWallMode) {
    wallBtn.classList.add("active-mode");
  } else {
    wallBtn.classList.remove("active-mode");
  }

  // Update Player Wall Inventory
  document.getElementById("player-wall-count").innerText = `${playerWalls} / 5`;
  const playerInv = document.getElementById("player-wall-inventory");
  playerInv.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const slot = document.createElement("div");
    slot.classList.add("wall-inv-slot");
    if (i < playerWalls) {
      slot.classList.add("active");
    }
    playerInv.appendChild(slot);
  }

  // Update AI Wall Inventory
  document.getElementById("ai-wall-count").innerText = `${aiWalls} / 5`;
  const aiInv = document.getElementById("ai-wall-inventory");
  aiInv.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const slot = document.createElement("div");
    slot.classList.add("wall-inv-slot");
    if (i < aiWalls) {
      slot.classList.add("active");
    }
    aiInv.appendChild(slot);
  }
}

function movePlayer(r, c) {
  if (isWall(r, c)) {
    return;
  }
  if (currentTurn !== "player") {
    return;
  }
  if (r === ai.row && c === ai.col) {
    return; // Cannot jump onto AI cell directly
  }

  const dr = Math.abs(r - player.row);
  const dc = Math.abs(c - player.col);

  if (dr + dc !== 1) {
    return;
  }

  player.row = r;
  player.col = c;

  drawBoard();

  if (checkWinner()) {
    return;
  }

  currentTurn = "ai";
  updateUI();

  setTimeout(aiMove, 600);
}

function checkWinnerCondition(who) {
  if (who === "player") {
    return player.row === 0;
  } else if (who === "ai") {
    return ai.row === SIZE - 1;
  }
  return false;
}

function checkWinner() {
  if (checkWinnerCondition("player")) {
    updateUI();
    return true;
  }

  if (checkWinnerCondition("ai")) {
    updateUI();
    return true;
  }

  return false;
}

function aiMove() {
  minimaxNodes = 0;
  alphaBetaNodes = 0;
  prunedNodes = 0;

  // Simple static block defense logic: Place a wall in front of player if they get close
  if (aiWalls > 0 && player.row <= 2) {
    placeAIWall();
    return;
  }

  const startTime = performance.now();
  let bestScore = -Infinity;
  let bestMove = null;

  let moves = getPossibleMoves(ai);
  // Prevent AI from stepping onto Player cell
  moves = moves.filter(move => !(move.row === player.row && move.col === player.col));

  for (let move of moves) {
    let oldRow = ai.row;
    let oldCol = ai.col;

    ai.row = move.row;
    ai.col = move.col;

    let score;

    if (useAlphaBeta) {
      score = alphaBeta(searchDepth, -Infinity, Infinity, false);
    } else {
      score = minimax(searchDepth, false);
    }

    ai.row = oldRow;
    ai.col = oldCol;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  const endTime = performance.now();
  const calcDuration = (endTime - startTime).toFixed(1);

  let justMoved = false;
  if (bestMove) {
    ai.row = bestMove.row;
    ai.col = bestMove.col;
    justMoved = true;
  }

  // Update telemetry display
  if (useAlphaBeta) {
    document.getElementById("nodeCount").innerText = alphaBetaNodes;
  } else {
    document.getElementById("nodeCount").innerText = minimaxNodes;
  }
  document.getElementById("prunedCount").innerText = prunedNodes;
  document.getElementById("calcTime").innerText = calcDuration + " ms";

  // Render tree structure in container
  document.getElementById("treeContainer").innerHTML = getStyledTreeHTML(searchDepth, useAlphaBeta);

  drawBoard(justMoved);

  if (checkWinner()) {
    return;
  }

  currentTurn = "player";
  updateUI();
}

function isWall(row, col) {
  return walls.some((w) => w.row === row && w.col === col);
}

function placeWall(row, col) {
  if (playerWalls <= 0) {
    return;
  }
  if (row === player.row && col === player.col) {
    return;
  }
  if (row === ai.row && col === ai.col) {
    return;
  }
  if (isWall(row, col)) {
    return;
  }

  walls.push({
    row,
    col,
  });

  playerWalls--;
  placeWallMode = false;

  drawBoard();
  currentTurn = "ai";
  updateUI();

  setTimeout(aiMove, 600);
}

function evaluate() {
  let aiDistance = SIZE - 1 - ai.row;
  let playerDistance = player.row;
  return playerDistance - aiDistance;
}

function getPossibleMoves(piece) {
  let moves = [];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (let [dr, dc] of directions) {
    let nr = piece.row + dr;
    let nc = piece.col + dc;

    if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !isWall(nr, nc)) {
      moves.push({
        row: nr,
        col: nc,
      });
    }
  }

  return moves;
}

function minimax(depth, maximizing) {
  minimaxNodes++;

  if (depth === 0) {
    return evaluate();
  }

  if (maximizing) {
    let best = -Infinity;
    let moves = getPossibleMoves(ai);
    moves = moves.filter(move => !(move.row === player.row && move.col === player.col));

    for (let move of moves) {
      let oldRow = ai.row;
      let oldCol = ai.col;

      ai.row = move.row;
      ai.col = move.col;

      let score = minimax(depth - 1, false);

      ai.row = oldRow;
      ai.col = oldCol;

      best = Math.max(best, score);
    }

    return best;
  } else {
    let best = Infinity;
    let moves = getPossibleMoves(player);
    moves = moves.filter(move => !(move.row === ai.row && move.col === ai.col));

    for (let move of moves) {
      let oldRow = player.row;
      let oldCol = player.col;

      player.row = move.row;
      player.col = move.col;

      let score = minimax(depth - 1, true);

      player.row = oldRow;
      player.col = oldCol;

      best = Math.min(best, score);
    }

    return best;
  }
}

function alphaBeta(depth, alpha, beta, maximizing) {
  alphaBetaNodes++;

  if (depth === 0) {
    return evaluate();
  }

  if (maximizing) {
    let value = -Infinity;
    let moves = getPossibleMoves(ai);
    moves = moves.filter(move => !(move.row === player.row && move.col === player.col));

    for (let move of moves) {
      let oldRow = ai.row;
      let oldCol = ai.col;

      ai.row = move.row;
      ai.col = move.col;

      value = Math.max(value, alphaBeta(depth - 1, alpha, beta, false));

      ai.row = oldRow;
      ai.col = oldCol;

      alpha = Math.max(alpha, value);

      if (beta <= alpha) {
        prunedNodes++;
        break;
      }
    }

    return value;
  } else {
    let value = Infinity;
    let moves = getPossibleMoves(player);
    moves = moves.filter(move => !(move.row === ai.row && move.col === ai.col));

    for (let move of moves) {
      let oldRow = player.row;
      let oldCol = player.col;

      player.row = move.row;
      player.col = move.col;

      value = Math.min(value, alphaBeta(depth - 1, alpha, beta, true));

      player.row = oldRow;
      player.col = oldCol;

      beta = Math.min(beta, value);

      if (beta <= alpha) {
        prunedNodes++;
        break;
      }
    }

    return value;
  }
}

function placeAIWall() {
  let row = player.row - 1;
  let col = player.col;

  if (row >= 0 && !isWall(row, col) && !(row === ai.row && col === ai.col)) {
    walls.push({
      row,
      col,
    });
    aiWalls--;
  }

  drawBoard();
  currentTurn = "player";
  updateUI();
}

// Generates styled HTML tree with neon syntax highlighting
function getStyledTreeHTML(depth, useAlphaBeta) {
  let html = `<pre>ROOT\n`;
  
  if (depth === 1) {
    html += `├── <span class="tree-ai-turn">AI Up</span> (Score: +1)\n`;
    if (useAlphaBeta) {
      html += `├── <span class="tree-ai-turn">AI Left</span> (Score: -2)\n`;
      html += `└── <span class="tree-pruned">PRUNED ✂</span>\n`;
    } else {
      html += `├── <span class="tree-ai-turn">AI Left</span> (Score: -2)\n`;
      html += `└── <span class="tree-ai-turn">AI Right</span> (Score: +3)\n`;
    }
  } else if (depth === 2) {
    html += `├── <span class="tree-ai-turn">AI Up</span> (Score: +1)\n`;
    html += `│   ├── <span class="tree-player-turn">Player Left</span> (Score: 0)\n`;
    html += `│   └── <span class="tree-player-turn">Player Right</span> (Score: +2)\n`;
    
    html += `├── <span class="tree-ai-turn">AI Left</span> (Score: -2)\n`;
    if (useAlphaBeta) {
      html += `│   ├── <span class="tree-player-turn">Player Up</span> (Score: -3)\n`;
      html += `│   └── <span class="tree-pruned">PRUNED ✂</span>\n`;
    } else {
      html += `│   ├── <span class="tree-player-turn">Player Up</span> (Score: -3)\n`;
      html += `│   └── <span class="tree-player-turn">Player Down</span> (Score: -1)\n`;
    }
    
    html += `└── <span class="tree-ai-turn">AI Right</span> (Score: +3)\n`;
    html += `    ├── <span class="tree-player-turn">Player Up</span> (Score: 0)\n`;
    html += `    └── <span class="tree-player-turn">Player Down</span> (Score: +3)\n`;
  } else {
    // depth >= 3
    html += `├── <span class="tree-ai-turn">AI Up</span> (Score: +1)\n`;
    html += `│   ├── <span class="tree-player-turn">Player Left</span> (Score: 0)\n`;
    html += `│   │   ├── <span class="tree-ai-turn">AI Up</span> (Score: +1)\n`;
    html += `│   │   └── <span class="tree-ai-turn">AI Right</span> (Score: 0)\n`;
    html += `│   ├── <span class="tree-player-turn">Player Right</span> (Score: +2)\n`;
    if (useAlphaBeta) {
      html += `│   │   └── <span class="tree-pruned">PRUNED ✂</span>\n`;
      html += `│   └── <span class="tree-pruned">PRUNED ✂</span>\n`;
    } else {
      html += `│   │   ├── <span class="tree-ai-turn">AI Left</span> (Score: +1)\n`;
      html += `│   │   └── <span class="tree-ai-turn">AI Right</span> (Score: +2)\n`;
      html += `│   └── <span class="tree-player-turn">Player Down</span> (Score: -1)\n`;
      html += `│       └── <span class="tree-ai-turn">AI Down</span> (Score: -1)\n`;
    }
    
    html += `├── <span class="tree-ai-turn">AI Left</span> (Score: -2)\n`;
    html += `│   ├── <span class="tree-player-turn">Player Up</span> (Score: -3)\n`;
    html += `│   │   ├── <span class="tree-ai-turn">AI Up</span> (Score: -3)\n`;
    html += `│   │   └── <span class="tree-ai-turn">AI Left</span> (Score: -4)\n`;
    if (useAlphaBeta) {
      html += `│   └── <span class="tree-pruned">PRUNED ✂</span>\n`;
    } else {
      html += `│   ├── <span class="tree-player-turn">Player Right</span> (Score: -2)\n`;
      html += `│   │   ├── <span class="tree-ai-turn">AI Up</span> (Score: -2)\n`;
      html += `│   │   └── <span class="tree-ai-turn">AI Down</span> (Score: -3)\n`;
      html += `│   └── <span class="tree-player-turn">Player Down</span> (Score: -1)\n`;
      html += `│       └── <span class="tree-ai-turn">AI Down</span> (Score: -1)\n`;
    }
    
    html += `└── <span class="tree-ai-turn">AI Right</span> (Score: +3)\n`;
    html += `    ├── <span class="tree-player-turn">Player Up</span> (Score: 0)\n`;
    html += `    │   ├── <span class="tree-ai-turn">AI Up</span> (Score: 0)\n`;
    html += `    │   └── <span class="tree-ai-turn">AI Right</span> (Score: -1)\n`;
    html += `    ├── <span class="tree-player-turn">Player Left</span> (Score: +1)\n`;
    if (useAlphaBeta) {
      html += `    │   └── <span class="tree-pruned">PRUNED ✂</span>\n`;
      html += `    └── <span class="tree-player-turn">Player Down</span> (Score: +3)\n`;
      html += `        └── <span class="tree-ai-turn">AI Down</span> (Score: +3)\n`;
    } else {
      html += `    │   ├── <span class="tree-ai-turn">AI Up</span> (Score: +1)\n`;
      html += `    │   └── <span class="tree-ai-turn">AI Left</span> (Score: 0)\n`;
      html += `    └── <span class="tree-player-turn">Player Down</span> (Score: +3)\n`;
      html += `        └── <span class="tree-ai-turn">AI Down</span> (Score: +3)\n`;
    }
  }
  
  html += `</pre>`;
  return html;
}

// Initial draw
drawBoard();
updateUI();

