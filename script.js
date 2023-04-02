const numberOfMines = 10;
const boardSize = 10;
const board = document.querySelector(".board");
const infoField = document.querySelector(".subtext");
const markedCountElement = document.querySelector("[data-marked-count]");
let markedCount = numberOfMines;

markedCountElement.textContent = markedCount;
const boardElements = [];
let tilesToReveal = boardSize ** 2;

function initiate() {
  board.style.setProperty("--size", boardSize);
  const mines = getRandomMines();
  let elementNumber = 0;
  for (let x = 0; x < boardSize; x++) {
    boardElements.push([]);
    for (let y = 0; y < boardSize; y++) {
      const tile = document.createElement("div");
      tile.dataset.id = `${x}-${y}`;
      tile.dataset.status = "hidden";
      board.appendChild(tile);
      boardElements[x].push(mines.includes(elementNumber));
      elementNumber++;
    }
  }
  board.addEventListener("contextmenu", rightClick);
  board.addEventListener("click", leftClick);
}

function getRandomMines() {
  const arrayOfMines = [];
  while (arrayOfMines.length < numberOfMines) {
    let randomMine = Math.floor(Math.random() * boardSize * boardSize);
    if (!arrayOfMines.includes(randomMine)) arrayOfMines.push(randomMine);
  }
  return arrayOfMines;
}

function endGame(status) {
  board.removeEventListener("contextmenu", rightClick);
  board.removeEventListener("click", leftClick);
  infoField.textContent = status === "lost" ? "You lost!" : "You won!";
}

function rightClick(e) {
  if (e.target.hasAttribute("data-id")) {
    e.preventDefault();
    if (e.target.dataset.status === "hidden") {
      e.target.dataset.status = "marked";
      markedCount--;
    } else {
      e.target.dataset.status = "hidden";
      markedCount++;
    }
    markedCountElement.textContent = markedCount;
  }
}

function leftClick(e) {
  if (e.target.dataset.id) {
    const coords = e.target.dataset.id.split("-");
    const x = parseInt(coords[0]);
    const y = parseInt(coords[1]);

    if (boardElements[coords[0]][coords[1]] === true) {
      e.target.dataset.status = "mine";
      endGame("lost");
      revealMines();
    } else {
      revealTile(x, y);
    }
  }
}

function revealTile(x, y) {
  const tile = board.querySelector(`[data-id="${x}-${y}"]`);
  if (tile.dataset.status === "number") {
    return;
  } else {
    tile.dataset.status = "number";
    const neighborsArray = [];
    const possibleNeighborsArray = [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ];

    for (let [x, y] of possibleNeighborsArray) {
      if (x >= 0 && y >= 0 && x < boardSize && y < boardSize) {
        neighborsArray.push([x, y]);
      }
    }

    let nearMinesCount = 0;
    for (let [x, y] of neighborsArray) {
      if (boardElements[x][y] === true) {
        nearMinesCount++;
      }
    }

    if (nearMinesCount) {
      tile.textContent = nearMinesCount;
    } else {
      for (let [x, y] of neighborsArray) {
        revealTile(x, y);
      }
    }
    tilesToReveal--;
    if (tilesToReveal === numberOfMines) endGame("won");
  }
}

function revealMines() {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (boardElements[x][y] === true) {
        board.querySelector(`[data-id="${x}-${y}"]`).dataset.status = "mine";
      }
    }
  }
}

initiate();
