/*************************************************
* DUCK CIT - Star background animation setup
*************************************************/

const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");
const stars = [];
const starCount = 200;

// Handle canvas resizing
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars.forEach((star) => {
        star.x = (star.posX / 100) * canvas.width;
        star.y = (star.posY / 100) * canvas.height;
    });
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Star class for individual star properties and behavior
class Star {
    constructor() {
        this.posX = Math.random() * 100;
        this.posY = Math.random() * 100;
        this.x = (this.posX / 100) * canvas.width;
        this.y = (this.posY / 100) * canvas.height;
        this.size = Math.random() * 1 + 0.8;
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = 0.03;
        this.opacity = 0.6;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleTime = Math.random() * Math.PI * 2;
    }

    update() {
        this.angle += (Math.random() - 0.5) * 0.02;
        this.posX += Math.cos(this.angle) * this.speed;
        this.posY += Math.sin(this.angle) * this.speed;

        if (this.posX < 5 || this.posX > 95) this.angle = Math.PI - this.angle;
        if (this.posY < 5 || this.posY > 95) this.angle = -this.angle;
        this.posX = Math.max(0, Math.min(100, this.posX));
        this.posY = Math.max(0, Math.min(100, this.posY));

        this.x = (this.posX / 100) * canvas.width;
        this.y = (this.posY / 100) * canvas.height;

        this.twinkleTime += this.twinkleSpeed;
        this.opacity = 0.4 + 0.4 * Math.sin(this.twinkleTime);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// Create stars
for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
}

// Animation control variables
let lastTime = 0;
const fps = 60;
let animationFrameId;
let isActive = true;

// Main animation loop
function animate(timestamp) {
    if (isActive) {
        if (timestamp - lastTime >= 1000 / fps) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach((star) => {
                star.update();
                star.draw();
            });
            lastTime = timestamp;
        }
    }
    animationFrameId = requestAnimationFrame(animate);
}

// Performance optimization with IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !document.hidden) {
        if (!isActive) {
            lastTime = performance.now();
        }
        isActive = true;
    } else {
        isActive = false;
    }
}, { threshold: 0 });

observer.observe(canvas);

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        observer.observe(canvas);
    }
});

animate(performance.now());
