const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

const clearButton = document.getElementById("clear");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Node {
    constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
    }
}

let nodes = [];
let currentValue = 0;

let edgeStartNode = null;
let edgeEndNode = null;

let draggedNode = null;

const RADIUS = 30;

clearButton.onclick = function() {
    nodes = [];
    currentValue = 0;
    draw();
};

window.addEventListener("resize", function(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});

canvas.addEventListener("mouseup", function(e) {
    draggedNode = null;
    draw();
});

canvas.addEventListener("mousedown", function(e) {
    let x = e.clientX;
    let y = e.clientY;

    // Left Click
    if (e.button === 0) {
        let node = getNodeAtPosition(x, y);
        if (node == null) {
            nodes.push(new Node(currentValue, x, y))
            currentValue += 1;
        } else {
            draggedNode = node;
        }
    }
    
    draw();
});

canvas.addEventListener("mousemove", function(e) {
    if (draggedNode != null) {
        let x = e.clientX;
        let y = e.clientY;
        draggedNode.x = x;
        draggedNode.y = y;
        draw();
    }
});

function draw() {
    // Draw background
    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw nodes
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    nodes.forEach(node => {
        // Draw Circle
        ctx.fillStyle = "#777777";
        ctx.beginPath();
        ctx.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
        ctx.fill();

        // Draw Text
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(node.value,node.x,node.y);
    })
}

function getNodeAtPosition(x, y) {
    RADIUS_SQUARED = RADIUS ** 2;
    return nodes.find(node => {
        let distance = (node.x - x) ** 2 + (node.y - y) ** 2;
        if (distance < RADIUS_SQUARED) {
            return node;
        }
    }) || null;
}