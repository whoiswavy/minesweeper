var board = [];
var  rows = 8;
var columns = 8;

var minesCount = 5;
var minesLocation = []; // "2-2", "3-7", "4-6"

var tilesClicked = 0; // goal to click all tiles except the ones containing mines
var flagEnabled = false;

var gameOver = false; 

window.onload = function() {
    startGame();
}

function setMines(mines) {
    minesLocation.push("2-2");
    minesLocation.push("3-7");
    minesLocation.push("4-6");
    minesLocation.push("1-1");
    minesLocation.push("2-5");
}

function startGame() {
    document.getElementById("mines-count").innerHTML = minesCount;
    document.getElementById('flag-button').addEventListener("click", setFlag)
    setMines()

    // populate our board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <div id="0-0"></div> 
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile)
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgrey"
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgrey"
    }
}

function clickTile() { 
    if (gameOver || this.classList.contains("")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩"
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER!");
        gameOver = true;
        revealMines();
        return;
    }


    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0  || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    // top 3
    minesFound += checkTile(r-1, c-1);          // top left
    minesFound += checkTile(r-1, c);          // top 
    minesFound += checkTile(r-1, c+1);          // top right

    // left and right
    minesFound += checkTile(r, c-1);            // left
    minesFound += checkTile(r, c+1);            // right

    // bottom 3
    minesFound += checkTile(r+1, c-1);          // bottom left
    minesFound += checkTile(r+1, c);          // bottom 
    minesFound += checkTile(r+1, c+1);          // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        // top 3
        checkMine(r-1, c-1);        // top left
        checkMine(r-1, c);          // top
        checkMine(r-1, c+1);        // top right

        // left and right
        checkMine(r, c-1);          // left
        checkMine(r, c+1);          // right

        // bottom 3
        checkMine(r+1, c-1);        // bottom left
        checkMine(r+1, c);          // bottom
        checkMine(r+1, c+1);        // bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared 🎉";
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0  || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString()+ "-" + c.toString())) {
        return 1;
    }
    return 0;
}
