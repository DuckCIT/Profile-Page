// Initialize page visibility
window.addEventListener('load', function () {
    document.body.classList.remove('hidden');
});

// Handle canvas resizing
function resizeCanvas() {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Tilt effect state management
let tiltState = { rotateX: 0, rotateY: 0 };
let tiltAnimationFrame = null;

// Initialize tilt effect for profile card
function initTiltEffect() {
    const card = document.querySelector(".glowing-border");
    if (!card) return;

    // Cancel any existing animation frame
    if (tiltAnimationFrame) {
        cancelAnimationFrame(tiltAnimationFrame);
    }

    let rotateX = tiltState.rotateX, rotateY = tiltState.rotateY;
    let targetX = rotateX, targetY = rotateY;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    function updateTilt() {
        rotateX += (targetX - rotateX) * 0.1;
        rotateY += (targetY - rotateY) * 0.1;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 10px rgba(187, 185, 198, 0.3)`;

        tiltState.rotateX = rotateX;
        tiltState.rotateY = rotateY;

        tiltAnimationFrame = requestAnimationFrame(updateTilt);
    }

    if (!isMobile) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            targetX = ((e.clientY - centerY) / (rect.height / 2)) * -15;
            targetY = ((e.clientX - centerX) / (rect.width / 2)) * 15;
        });

        card.addEventListener("mouseleave", () => {
            targetX = 0;
            targetY = 0;
        });
    }

    if (isMobile) {
        if (window.scrollTiltHandler) {
            window.removeEventListener("scroll", window.scrollTiltHandler);
        }
        window.scrollTiltHandler = () => {
            const rect = card.getBoundingClientRect();
            const windowHeight = document.documentElement.clientHeight;
            const cardCenter = rect.top + rect.height / 2;
            const scrollCenter = windowHeight / 2;
            targetX = ((cardCenter - scrollCenter) / (windowHeight / 2)) * -10;
            targetY = ((scrollCenter - cardCenter) / (windowHeight / 2)) * 10;
        };
        window.addEventListener("scroll", window.scrollTiltHandler);
    }

    updateTilt();
}

// Initialize tilt effect on page load
document.addEventListener("DOMContentLoaded", () => {
    initTiltEffect();
    
    // Set up MutationObserver to detect DOM changes
    if (!window.tiltObserver) {
        window.tiltObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length || mutation.removedNodes.length) {
                    // Small delay to ensure DOM is fully updated
                    setTimeout(initTiltEffect, 100);
                }
            });
        });

        // Start observing the document body for changes
        window.tiltObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});

// Handle window resize
window.addEventListener("resize", () => {
    requestAnimationFrame(initTiltEffect);
});
