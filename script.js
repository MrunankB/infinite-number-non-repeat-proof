var canvas = document.getElementById("canvas");
var generationDisplay = document.getElementById("generations");
var ctx = canvas.getContext("2d");

document.onkeypress = function(evt) {
    var evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    keyUpdate(charStr, evt);
}

function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor((event.clientX - rect.left - 2) / gridSize) + 1,
      y: Math.floor((event.clientY - rect.top - 2) / gridSize) + 1
    }
}

function drawLine(x, y, x0, y0) {
    ctx.beginPath();
    ctx.strokeStyle = "gray";
    ctx.moveTo(x, y);
    ctx.lineTo(x0, y0);
    ctx.stroke();
}

function drawRect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.stroke();
}

var isRunning = false;
var gridSize = 18;
var frame = false;

var showGrid = true;

var width = 167;
var height = 95;
var generations = 0;
canvas.width = width * gridSize;
canvas.height = height * gridSize;

class MatrixNode {
    constructor(key, xm, ym) {
        this.xm = xm;
        this.ym = ym;
        this.key = key;
    }

    update(key, xm, ym) {
        this.xm = xm;
        this.ym = ym;
        this.key = key;
    }
}

class Matrix {
    constructor() {
        this.nodes = [];
        this.nodesData = [];
        this.sizeX = 0;
        this.sizeY = 0;
        this.size = 0;
    }

    update(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var updateNode = nodes[i];
            var node = this.nodes[i];
            node.update(updateNode.key, updateNode.xm, updateNode.ym);
        }
    }

    build(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.size = this.sizeX * this.sizeY;

        for (var y = 1; y <= this.sizeY; y++) {
            for (var x = 1; x <= this.sizeX; x++) {
                let newNode = new MatrixNode(0, x, y);
                this.nodes.push(newNode);
            }
            x = 0;
        }
    }

    getNode(x, y) {
        if (y <= 0) {
            let bufferNode = new MatrixNode(0, 0, 0);
            return bufferNode;
        } else if (x <= 0) {
            let bufferNode = new MatrixNode(0, 0, 0);
            return bufferNode;
        } else if (y > this.sizeY) {
            let bufferNode = new MatrixNode(0, 0, 0);
            return bufferNode;
        } else if (x > this.sizeX) {
            let bufferNode = new MatrixNode(0, 0, 0);
            return bufferNode;
        }
        return this.nodes[(y - 1) * this.sizeX + x - 1];
    }

    find(key) {
        var keyNodes = [];

        for (i = 0; i < keyNodes.length; i++) {
            if (this.nodes[i].key == key) {
                keyNodes.push(this.nodes[i]);
            }
        }

        return keyNodes;
    }
}

let game = new Matrix();
let gameF = new Matrix();
game.build(width, height);
gameF.build(width, height);

function check(node) {
    var neighbors = 0;
    if (game.getNode(node.xm - 1, node.ym + 1).key > 0) {
        neighbors++;
    }

    if (game.getNode(node.xm, node.ym + 1).key > 0) {
        neighbors++;
    }

    if (game.getNode(node.xm + 1, node.ym + 1).key > 0) {
        neighbors++;
    }

    if (game.getNode(node.xm - 1, node.ym).key > 0) {
        neighbors++;
    }

    if (game.getNode(node.xm + 1, node.ym).key > 0) {
        neighbors++;
    }

    if (game.getNode(node.xm - 1, node.ym - 1).key > 0) {
        neighbors++;
    }

    if (game.getNode(node.xm, node.ym - 1).key > 0) {
        neighbors++;
    }

    if (game.getNode(node.xm + 1, node.ym - 1).key > 0) {
        neighbors++;
    }

    return neighbors;
}

function update() {
    game.update(gameF.nodes);
    for (var i = 0; i < game.nodes.length; i++) {
        var node = gameF.nodes[i];
        var neighbors = check(game.getNode(node.xm, node.ym));
        switch(neighbors) {
            case 2:
                break;

            case 3:
                node.key = 1;
                break;

            default:
                node.key = 0;
                break;
            }
    }
    game.update(gameF.nodes);
    frame = false;
}

function clickUpdate(event) {
    var pos = getMousePos(event);
    switch(gameF.getNode(pos.x, pos.y).key) {
        case 1:
            gameF.getNode(pos.x, pos.y).key = 0;
            break;

        case 0:
            gameF.getNode(pos.x, pos.y).key = 1;
            break;
    }

}

function keyUpdate(event, evt) {
    switch(event) {
        case "s":
            if (isRunning) {
                isRunning = false;
            }

            else {
                isRunning = true;
            }
            break;

        case "f":
            frame = true;
            isRunning = false;
            break;

        case "g":
            if (showGrid) {
                showGrid = false;
            }

            else {
                showGrid = true;
            }
            break;

        case "c":
            for (var i = 0; i < gameF.nodes.length; i++) {
                if (gameF.nodes[i].key == 1) {
                    gameF.nodes[i].key = 0;
                }
            }
            
            generations = 0;

            break;

        case "r":
            for (var i = 0; i < gameF.nodes.length; i++) {
                gameF.nodes[i].key = Math.round(Math.random())
            }

            generations = 0;

            break;

        default:
            console.log(event)
    }
}

function draw() {

    generationDisplay.innerHTML = "Generations: " + generations.toString();

    for (var nodeIndex = 0; nodeIndex < gameF.nodes.length; nodeIndex++) {
        var node = gameF.nodes[nodeIndex];
        if (node.key == 1) {
            drawRect((node.xm - 1) * gridSize + 1, (node.ym - 1) * gridSize + 1, gridSize - 1, gridSize - 1, "white");
        }
    }

    if (showGrid) {
        for (var column = 1; column <= width; column++) {
            drawLine(column * gridSize, 0, column * gridSize, height * gridSize);
        }

        for (var row = 1; row <= height; row++) {
            drawLine(0, row * gridSize, width * gridSize, row * gridSize);
        }
    }
}

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isRunning == true || frame == true) {
        update();
        generations++;
    }

    draw();
}

setInterval(main, 10);