//Canvas board
const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = 'bold 48px serif';

//Interact
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click : false
};

canvas.addEventListener("mousedown", function (e) {
    mouse.click = true;
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
    console.log( mouse.x, mouse.y);

});

canvas.addEventListener("mouseup", function () {
    mouse.click = false;
});




//Player
const playerLeft = new Image();
playerLeft.src = "img/fish-left.png";
const playerRight = new Image();
playerRight.src = "img/fish-right.png";
class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 490;
        this.spriteHeight = 327;
    }
        update() {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            let theta = Math.atan2(dy,dx);
            this.angle = theta;
            if(mouse.x != this.x){
                this.x -= dx/20;
            }
            if(mouse.y != this.y){
                this.y -= dy/20;
            }
        }
        draw() {
            if(mouse.click) {
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(mouse.x,mouse.y);
                ctx.stroke();
            }
            ctx.fillStyle = "#FFFF";
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.fillRect(this.x,this.y,this.radius,10);

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            if(this.x >= mouse.x){
                ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,0 - 60 ,0 - 45,this.spriteWidth/4,this.spriteHeight/4);
            }else{
                ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight, 0 - 60 , 0 - 45, this.spriteWidth/4, this.spriteHeight/4);
            }
            ctx.restore();
            
        }  
}

const player = new Player();


// Bubbles
const bubblesArr = [];

class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.cound = false;
        
    }

    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    draw() {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

function handleBubbles() {
    if(gameFrame % 50 === 0){
        bubblesArr.push(new Bubble());
    }
    for( let i = 0; i < bubblesArr.length; i++){
        bubblesArr[i].update();
        bubblesArr[i].draw();
    }
    for( let i = 0; i < bubblesArr.length; i++){
        if(bubblesArr[i].y < 0 - bubblesArr[i].radius * 2){
            bubblesArr.splice(i,1);
        }
        if(bubblesArr[i]){
            if( bubblesArr[i].distance < bubblesArr[i].radius + player.radius){
                if(!bubblesArr[i].cound){
                    score++;
                    bubblesArr[i].cound = true;
                    bubblesArr.splice(i,1);
                }
            }
        }
        
    }
}

//Animation

function animate () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = "black";
    
    ctx.fillText(`score:` + score, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate);
}

animate ();