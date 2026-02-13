const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

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

const RADIUS = 30;

window.addEventListener("resize", function(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});

canvas.addEventListener("mousedown", function(e) {
    let x = e.clientX;
    let y = e.clientY;

    // Left Click
    if (e.button === 0) {
        nodes.push(new Node(currentValue, x, y))
        currentValue += 1;
    }
    
    draw();
})

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
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx.stroke();
}