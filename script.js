
let boardArray = [];

let timer = 0;

let debug = [];

let gameover = false;

let width, height = 16;

const urlParams = new URLSearchParams(window.location.search);

function load() {
    
    let w = parseInt(urlParams.get('width'));
    let h = parseInt(urlParams.get('height'));
    let m = parseFloat(urlParams.get('mines'));


    if(!(w > 0)) w = 16;
    if(!(h > 0)) h = 16;
    if(!(m > 0)) m = 0.18;

    const mineAmount = parseInt(Math.round(w*h*m));
    width = w;
    height = h;
    generateBoard(mineAmount);
    createBoardHTML();
}

setInterval(() => {
    if(!gameover) {
        
    timer+=1;
    document.getElementById('timer').innerHTML = timer + "s";
    }
}, 1000);

function generateBoard(mines) {
    
    // GENERATE 2D ARRAY FOR THE BOARD
    boardArray = Array(height);

    for(let i = 0; i < boardArray.length; i++) {
        boardArray[i] = new Array(width);
    }
    debug = boardArray.map(function(arr) {
        return arr.slice();
    });

    console.log(boardArray);

    //SET ALL VALUES IN THE ARRAY TO 0
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            boardArray[y][x] = 0;
        }

    }

    //RANDOMLY GENERATES THE MINES
    for(let i = 0; i < mines; i++) {
        let randX = Math.floor(Math.random() * width);
        
        let randY = Math.floor(Math.random() * height);

        boardArray[randY][randX] = "X";
    }

    //CALCULATE
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            boardArray[y][x] = CheckMinesAround(x, y);
        }

    }

}

let a, b;

function CheckMinesAround(x, y) {
    let num = boardArray[y][x];

    debug[y][x] = new Array("", "", "",
    "", "C","",
    "", "", "");

    if(boardArray[y][x] != "X") {
        /*
        ["-1 -1", "+0 -1", "+1 -1"]
        ["-1 +0", "+0 +0", "+1 +0"]
        ["-1 +1", "+0 +1", "+1 +1"]

        */

        // CHECK IF MINES IS TOP LEFT
        if(isMineAt(x-1, y-1)) {
            num += 1;
            debug[y][x][0] = "X";
        }
        
        // CHECK IF MINES IS TOP CENTER
        if(isMineAt(x, y-1)) {
            num += 1;
            
            debug[y][x][1] = "X";
        }
        
        // CHECK IF MINES IS TOP RIGHT
        if(isMineAt(x+1, y-1)) {
            num += 1;
            
            debug[y][x][2] = "X";
        }

        //CHECK IF MINES IS CENTER LEFT
        if(isMineAt(x-1, y)) {
            num += 1;
            
            debug[y][x][3] = "X";
        }

        //CHECK IF MINES IS CENTER RIGHT
        if(isMineAt(x+1, y)) {
            num += 1;
            
            debug[y][x][5] = "X";
        }


        //CHECK IF MINES BOTTOM LEFT
        if(isMineAt(x-1, y+1)) {
            num += 1;
            
            debug[y][x][6] = "X";
        }
        //CHECK IF MINES BOTTOM CENTER
        if(isMineAt(x, y+1)) {
            num += 1;
            
            debug[y][x][7] = "X";
        }
        //CHECK IF MINES BOTTOM RIGHT
        if(isMineAt(x+1, y+1)) {
            num += 1;
            
            debug[y][x][8] = "X";
        }
        



    }
    
    return num;

}

function isMineAt(x, y) {
    if(x < 0 || x >= width) {
        return false;
    }
    if(y < 0 || y >= height) {
        return false;
    }

    if(boardArray[y][x] == "X") {
        //console.log("x: ", a, "y: ", b)
        //console.log("MINE AT: x:", x, " y:", y);
        return true;
    }
    return false;
}

function clickMine(element, x, y) {
    if(gameover)
        return

    if(window.event.shiftKey) {

        if(element.innerHTML == "🚩") {
            element.innerHTML = "";
            
            element.className = "cell";
        } else if(element.innerHTML == "") {
            element.innerHTML = "🚩";
            element.className = "cell cell-marked";
        }
        

    } else if(element.innerHTML != "🚩") {
        
    if(boardArray[y][x] == "X") {
        element.innerHTML = "💣";
        
        element.className = "cell cellX";
        document.getElementById('header').innerHTML = "Minesweeper (Gameover)";
        gameover = true;
    } else if(boardArray[y][x] == 0) {
        SweepZeros(x,y);
    }
    else
    Sweep(element, x, y);
    }
//    console.log("x:", x, " y:", y);
  //  console.log(debug[x][y]);



}

function Sweep(element,x,y) {
    element.innerHTML = boardArray[y][x];
    element.className = "cell cell" + boardArray[y][x];
}

function SweepZeros(x, y) {

    if(x < 0 || x >= width) {
        return;
    }
    if(y < 0 || y >= height) {
        return;
    }
    const id = x + "-" + y;

    if(document.getElementById(id).innerHTML != "") { //Check if already sweeped
        return;
    }

    Sweep(document.getElementById(id), x, y);
    
    if(boardArray[y][x] == 0) {
        SweepZeros(x-1, y-1);
        SweepZeros(x, y-1);
        SweepZeros(x+1, y-1);

        SweepZeros(x, y-1);
        SweepZeros(x, y+1);

        SweepZeros(x-1, y+1);
        SweepZeros(x, y+1);
        SweepZeros(x+1, y+1);
    }
}

function createBoardHTML() {
    let width, height;
    width = boardArray.length;
    for(let x = 0; x < boardArray.length; x++) {
        height = boardArray[x].length;
        for(let y = 0; y < boardArray[x].length; y++) {
  
            document.getElementById("board").innerHTML += `
            
        <button onclick='clickMine(this, ${x}, ${y})' id="${x}-${y}" type="button" class="cell"></button>
            `;
        }
    }
    let root = document.querySelector(':root');
    root.style.setProperty("--board-width", width);
    
    root.style.setProperty("--board-height", height);


}