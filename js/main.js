let root = document.getElementById("life-frame");
let matrix = [];
let lifeMatrix = [], oldLifeMatrix;


const ROWS = 25;
const COLS = 25;
const FILL_COLOR = "green";
const UNFILL_COLOR = "#42AE23";


function parseID(id) {
    id = id.split("-");
    let row = parseInt(id[1]);
    let col = parseInt(id[2]);
    return [row, col];
}


function onCellClick() {
    this.style.backgroundColor = FILL_COLOR;
    let tmp = parseID(this.id);
    let row = tmp[0], col = tmp[1];
    lifeMatrix[row][col] = true;
}

function drawField(rows, cols) {
    for (let i = 0; i < rows; i++) {
        let tmpTr = document.createElement("tr");
        root.appendChild(tmpTr);
        matrix.push([]);
        lifeMatrix.push([]);
        for (let j = 0; j < cols; j++) {
            let tmpTd = document.createElement("td");
            tmpTd.id = "cell-" + i + "-" + j;
            tmpTd.addEventListener("mouseover", onCellClick);
            matrix[i][j] = tmpTd;
            lifeMatrix[i][j] = false;
            tmpTr.appendChild(tmpTd)
        }
    }
    let startButton = document.createElement("div");
    startButton.addEventListener("click", loop);
    startButton.id = "start-button";
    document.getElementsByClassName("full-screen")[0].appendChild(startButton);
}


function fillCell(x, y) {
    matrix[x][y].style.backgroundColor = FILL_COLOR;
}

function unfillCell(x, y) {
    matrix[x][y].style.backgroundColor = UNFILL_COLOR;
}


function checkLife(x, y, m) {
    try {
        if (m[x][y]) {
            return 1
        } else {
            return 0
        }
    } catch (e) {
        return 0
    }
}

function born(x, y, m) {
    m[x][y] = true;
}

function countLiversNear(x, y) {
    let summary = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            summary += checkLife(x + i, y + j, lifeMatrix);
        }
    }
    summary -= checkLife(x, y);
    return summary;
}

function predictLifeInCell(x, y, m) {
    if (countLiversNear(x, y) > 2) {
        born(x, y, m)
    }
}

function recalculateLifeMatrix() {
    let tmp = cloneMatrix(lifeMatrix);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            predictLifeInCell(i, j, tmp);
        }
    }
    lifeMatrix = tmp
}

function redrawField() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (checkLife(i, j, lifeMatrix)) {
                fillCell(i, j)
            }
        }
    }
}

function killOldLife() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (checkLife(i, j, oldLifeMatrix)) {
                lifeMatrix[i][j] = false;
                unfillCell(i, j)
            }
        }
    }
}

function cloneMatrix(m) {
    let new_m = [];
    for (let i = 0; i < ROWS; i++) {
        new_m.push([]);
        for (let j = 0; j < COLS; j++) {
            new_m[i][j] = m[i][j];
        }
    }
    return new_m
}


function loop() {
    oldLifeMatrix = cloneMatrix(lifeMatrix);
    recalculateLifeMatrix();
    redrawField();
    killOldLife();
}

function start() {
    drawField(ROWS, COLS);
}

