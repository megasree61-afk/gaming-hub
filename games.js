const gameCatalog = [
  {
    id: "ttt",
    title: "Tic-Tac-Toe",
    category: "Strategy",
    icon: "✕",
    description: "A classic head-to-head. Think ahead, own the board.",
    players: "2 PLAYERS",
    panel: "game-ttt"
  },
  {
    id: "rps",
    title: "Rock Paper Scissors",
    category: "Arcade",
    icon: "✊",
    description: "One quick pick. One unpredictable opponent. Go on, then.",
    players: "VS THE HOUSE",
    panel: "game-rps"
  },
  {
    id: "guess",
    title: "Number Guess",
    category: "Casual",
    icon: "01",
    description: "Read the clues, trust your gut, find the hidden number.",
    players: "SOLO CHALLENGE",
    panel: "game-guess"
  }
];

const gameGrid = document.getElementById("game-grid");
const gameSearch = document.getElementById("game-search");
const gameCount = document.getElementById("game-count");
const categoryFilters = document.getElementById("category-filters");
let activeCategory = "All";

function renderGameCards() {
  const searchTerm = gameSearch.value.trim().toLocaleLowerCase();
  const filteredGames = gameCatalog.filter(game =>
    (activeCategory === "All" || game.category === activeCategory) &&
    `${game.title} ${game.category} ${game.description}`.toLocaleLowerCase().includes(searchTerm)
  );

  gameGrid.replaceChildren();
  gameCount.textContent = `${filteredGames.length} ${filteredGames.length === 1 ? "GAME" : "GAMES"} READY TO PLAY`;

  if (filteredGames.length === 0) {
    const empty = document.createElement("p");
    empty.className = "no-games";
    empty.textContent = "No games found. Try another search or category.";
    gameGrid.appendChild(empty);
    return;
  }

  filteredGames.forEach(game => {
    const card = document.createElement("article");
    card.className = "game-card";
    const visual = document.createElement("div");
    visual.className = `game-visual${game.category === "Strategy" ? " visual-strategy" : ""}${game.category === "Casual" ? " visual-casual" : ""}`;
    visual.setAttribute("aria-hidden", "true");
    const icon = document.createElement("span");
    icon.textContent = game.icon;
    visual.appendChild(icon);

    const info = document.createElement("div");
    info.className = "game-card-info";
    const top = document.createElement("div");
    top.className = "game-card-top";
    const title = document.createElement("h3");
    title.textContent = game.title;
    const tag = document.createElement("span");
    tag.className = "game-tag";
    tag.textContent = game.category;
    top.append(title, tag);
    const description = document.createElement("p");
    description.textContent = game.description;
    const footer = document.createElement("div");
    footer.className = "game-card-footer";
    const players = document.createElement("span");
    players.className = "game-meta";
    players.textContent = game.players;
    const playButton = document.createElement("button");
    playButton.className = "play-button";
    playButton.type = "button";
    playButton.textContent = "Play Now →";
    playButton.setAttribute("aria-label", `Play ${game.title} now`);
    playButton.addEventListener("click", () => selectMiniGame(game.id, true));
    footer.append(players, playButton);
    info.append(top, description, footer);
    card.append(visual, info);
    gameGrid.appendChild(card);
  });
}

function selectMiniGame(gameId, scrollToGame) {
  const selectedTab = document.querySelector(`[data-game-tab="${gameId}"]`);
  const selectedPanel = document.querySelector(`[data-game-panel="${gameId}"]`);
  if (!selectedTab || !selectedPanel) return;

  document.querySelectorAll("[data-game-tab]").forEach(tab => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });
  document.querySelectorAll("[data-game-panel]").forEach(panel => {
    const isSelected = panel === selectedPanel;
    panel.classList.toggle("is-active", isSelected);
    panel.hidden = !isSelected;
  });
  if (scrollToGame) {
    document.getElementById("arcade").scrollIntoView({ behavior: "smooth", block: "start" });
    selectedTab.focus({ preventScroll: true });
  }
}

categoryFilters.addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  categoryFilters.querySelectorAll("button[data-category]").forEach(filter => {
    const isSelected = filter === button;
    filter.classList.toggle("is-active", isSelected);
    filter.setAttribute("aria-pressed", String(isSelected));
  });
  renderGameCards();
});
gameSearch.addEventListener("input", renderGameCards);

document.querySelectorAll("[data-game-tab]").forEach((tab, index, tabs) => {
  tab.addEventListener("click", () => selectMiniGame(tab.dataset.gameTab, false));
  tab.addEventListener("keydown", event => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
    selectMiniGame(nextTab.dataset.gameTab, false);
    nextTab.focus();
  });
});

const ticTacToeCells = [...document.querySelectorAll(".ttt-cell")];
const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
let board = Array(9).fill("");
let currentPlayer = "X";
let ticTacToeFinished = false;

function resetTicTacToe() {
  board = Array(9).fill("");
  currentPlayer = "X";
  ticTacToeFinished = false;
  document.getElementById("ttt-status").textContent = "X's turn";
  ticTacToeCells.forEach((cell, index) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("cell-o", "cell-win");
    cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, empty`);
  });
}

ticTacToeCells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (ticTacToeFinished || board[index]) return;
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.toggle("cell-o", currentPlayer === "O");
    cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, ${currentPlayer}`);

    const winningLine = winningLines.find(line => line.every(position => board[position] === currentPlayer));
    if (winningLine) {
      ticTacToeFinished = true;
      winningLine.forEach(position => ticTacToeCells[position].classList.add("cell-win"));
      document.getElementById("ttt-status").textContent = `${currentPlayer} wins! Nicely played.`;
      ticTacToeCells.forEach(button => { button.disabled = true; });
      return;
    }
    if (board.every(Boolean)) {
      ticTacToeFinished = true;
      document.getElementById("ttt-status").textContent = "It's a draw. Run it back?";
      ticTacToeCells.forEach(button => { button.disabled = true; });
      return;
    }
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("ttt-status").textContent = `${currentPlayer}'s turn`;
  });
});
document.getElementById("ttt-restart").addEventListener("click", resetTicTacToe);

const rpsMoves = ["rock", "paper", "scissors"];
const rpsEmojis = { rock: "✊", paper: "✋", scissors: "✌" };
let playerScore = 0;
let houseScore = 0;

function resetRockPaperScissors() {
  playerScore = 0;
  houseScore = 0;
  document.getElementById("rps-player-score").textContent = playerScore;
  document.getElementById("rps-house-score").textContent = houseScore;
  document.getElementById("rps-status").textContent = "Make your move.";
  document.getElementById("rps-result").innerHTML = "<span>?</span><small>YOUR MOVE</small><span>?</span>";
}

document.querySelectorAll(".rps-choice").forEach(button => {
  button.addEventListener("click", () => {
    const playerMove = button.dataset.choice;
    const houseMove = rpsMoves[Math.floor(Math.random() * rpsMoves.length)];
    let result;
    if (playerMove === houseMove) {
      result = "It's a draw. Same wavelength.";
    } else if (
      (playerMove === "rock" && houseMove === "scissors") ||
      (playerMove === "paper" && houseMove === "rock") ||
      (playerMove === "scissors" && houseMove === "paper")
    ) {
      playerScore += 1;
      result = "You win this round!";
    } else {
      houseScore += 1;
      result = "The house takes this one.";
    }
    document.getElementById("rps-player-score").textContent = playerScore;
    document.getElementById("rps-house-score").textContent = houseScore;
    document.getElementById("rps-status").textContent = result;
    const resultPanel = document.getElementById("rps-result");
    resultPanel.replaceChildren();
    const playerChoice = document.createElement("span");
    playerChoice.textContent = rpsEmojis[playerMove];
    const resultText = document.createElement("small");
    resultText.textContent = `${playerMove.toUpperCase()} / ${houseMove.toUpperCase()}`;
    const houseChoice = document.createElement("span");
    houseChoice.textContent = rpsEmojis[houseMove];
    resultPanel.append(playerChoice, resultText, houseChoice);
  });
});
document.getElementById("rps-restart").addEventListener("click", resetRockPaperScissors);

let secretNumber = makeSecretNumber();
let attempts = 0;
let guessFinished = false;
const guessForm = document.getElementById("guess-form");
const guessInput = document.getElementById("guess-input");

function makeSecretNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function resetNumberGuess() {
  secretNumber = makeSecretNumber();
  attempts = 0;
  guessFinished = false;
  guessInput.disabled = false;
  guessForm.querySelector("button[type='submit']").disabled = false;
  guessInput.value = "";
  document.getElementById("guess-attempt-count").textContent = "0";
  document.getElementById("guess-status").textContent = "Your number is between 1 and 100.";
  document.getElementById("guess-history").replaceChildren();
  guessInput.focus();
}

guessForm.addEventListener("submit", event => {
  event.preventDefault();
  if (guessFinished || !guessForm.reportValidity()) return;
  const guess = Number(guessInput.value);
  if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
    guessInput.setCustomValidity("Enter a whole number from 1 to 100.");
    guessInput.reportValidity();
    return;
  }
  guessInput.setCustomValidity("");
  attempts += 1;
  document.getElementById("guess-attempt-count").textContent = attempts;
  const pill = document.createElement("span");
  pill.className = "guess-pill";
  pill.textContent = guess;
  pill.setAttribute("aria-label", `Guess ${guess}`);
  document.getElementById("guess-history").appendChild(pill);

  if (guess === secretNumber) {
    guessFinished = true;
    document.getElementById("guess-status").textContent = `You got it in ${attempts} ${attempts === 1 ? "try" : "tries"}!`;
    guessInput.disabled = true;
    guessForm.querySelector("button[type='submit']").disabled = true;
  } else {
    document.getElementById("guess-status").textContent = guess < secretNumber ? "Too low. Go higher." : "Too high. Go lower.";
    guessInput.value = "";
    guessInput.focus();
  }
});
guessInput.addEventListener("input", () => guessInput.setCustomValidity(""));
document.getElementById("guess-restart").addEventListener("click", resetNumberGuess);

renderGameCards();
resetTicTacToe();
resetRockPaperScissors();
