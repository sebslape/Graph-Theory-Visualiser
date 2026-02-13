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

class Edge {
    constructor(startNode, endNode, weight) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.weight = weight;
    }
}

let mouseX;
let mouseY;

let nodes = [];
let edges = [];
let currentValue = 0;

let edgeStartNode = null;
let edgeEndNode = null;

let draggedNode = null;

const RADIUS = 30;

canvas.addEventListener("contextmenu", e => e.preventDefault());

clearButton.onclick = function() {
    nodes = [];
    edges = [];
    currentValue = 0;
    draw();
};

window.addEventListener("resize", function(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});

canvas.addEventListener("mouseup", function(e) {
    if (edgeStartNode != null) {
        node = getNodeAtPosition(mouseX, mouseY);
        if (node != null) {
            edgeEndNode = node;
            edges.push(new Edge(edgeStartNode, edgeEndNode, 1))
            console.log(edges);
        }
    }
    edgeStartNode = null;
    edgeEndNode = null;
    draggedNode = null;
    draw();
});

canvas.addEventListener("mousedown", function(e) {
    // Left Click
    if (e.button === 0) {
        let node = getNodeAtPosition(mouseX, mouseY);
        if (node == null) {
            nodes.push(new Node(currentValue, mouseX, mouseY))
            currentValue += 1;
        } else {
            draggedNode = node;
        }
    } else if (e.button === 2) {
        let node = getNodeAtPosition(mouseX, mouseY);
        if (node != null) {
            edgeStartNode = node;
            console.log(edgeStartNode);
        }
    }
    draw();
});

canvas.addEventListener("mousemove", function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (draggedNode != null) {
        draggedNode.x = mouseX;
        draggedNode.y = mouseY;
        draw();
    } else if (edgeStartNode != null) {
        draw();
    }
});

function draw() {
    // Draw background
    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    ctx.lineWidth = 4;
    edges.forEach(edge => {
        ctx.strokeStyle = "#444444";
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(edge.startNode.x, edge.startNode.y);
        ctx.lineTo(edge.endNode.x, edge.endNode.y);
        ctx.stroke();
    });

    // Draw line when dragging edge
    if (edgeStartNode != null) {
        ctx.strokeStyle = "#666666";
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(edgeStartNode.x, edgeStartNode.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
    }

    // Draw nodes
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    nodes.forEach(node => {
        // Draw Circle
        ctx.fillStyle = "#999999";
        ctx.beginPath();
        ctx.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
        ctx.fill();

        // Draw Text
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(node.value,node.x,node.y);
    });
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