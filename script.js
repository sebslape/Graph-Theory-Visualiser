const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

const clearButton = document.getElementById("clear");
const clearColoursButton = document.getElementById("clear-colours");
const dfsButton = document.getElementById("dfs");
const bfsButton = document.getElementById("bfs");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Node {
    constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.colour = "default";
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
let directed_adjacency = new Map();
let undirected_adjacency = new Map();

let currentValue = 0;

let edgeStartNode = null;
let edgeEndNode = null;

let draggedNode = null;

const RADIUS = 30;

canvas.addEventListener("contextmenu", e => e.preventDefault());

clearColoursButton.onclick = function() {
    nodes.forEach(node => {
        node.colour = "default";
    });
    draw();
};

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
            directed_adjacency.get(edgeStartNode).push({node: edgeEndNode, weight: 1});
            //undirected_adjacency.get(edgeStartNode).push({node: edgeEndNode, weight: 1});
            //undirected_adjacency.get(edgeEndNode).push({node: edgeStartNode, weight: 1});
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
            new_node = new Node(currentValue, mouseX, mouseY)
            nodes.push(new_node)
            directed_adjacency.set(new_node, []);
            currentValue += 1;
        } else {
            draggedNode = node;
        }
    } else if (e.button === 2) {
        let node = getNodeAtPosition(mouseX, mouseY);
        if (node != null) {
            edgeStartNode = node;
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
        if (node.colour == "default") {
            ctx.fillStyle = "#999999";
        } else if (node.colour == "queued") {
            ctx.fillStyle = "#888888";
        } else if (node.colour == "selected") {
            ctx.fillStyle = "#bcbc3d";
        } else if (node.colour == "found") {
            ctx.fillStyle = "#5d5d22";
        }
        
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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function dfs() {
    let visited = new Set();
    let stack = [nodes[0]];

    visited.add(nodes[0]);

    while (stack.length > 0) {
        let currentNode = stack.pop();

        currentNode.colour = "selected";

        let neighbours = directed_adjacency.get(currentNode);

        for (const neighbour of neighbours) {
            if (!visited.has(neighbour.node)) {
                visited.add(neighbour.node);
                stack.push(neighbour.node);
            }
        }

        // Only change the colour of the upcoming node
        if (stack.length > 0) {
            stack[stack.length - 1].colour = "queued";
        }

        draw();
        await sleep(1000);
        currentNode.colour = "found";
    }
    draw();
}

async function bfs() {
    let visited = new Set();
    let queue = [nodes[0]];

    visited.add(nodes[0]);

    while (queue.length > 0) {
        let currentNode = queue.shift();

        currentNode.colour = "selected";

        let neighbours = directed_adjacency.get(currentNode);

        for (const neighbour of neighbours) {
            if (!visited.has(neighbour.node)) {
                neighbour.node.colour = "queued";
                visited.add(neighbour.node);
                queue.push(neighbour.node);
            }
        }

        draw();
        await sleep(1000);
        currentNode.colour = "found";
    }
    draw();
}

dfsButton.onclick = dfs;
bfsButton.onclick = bfs;