function initFoodRandom() {
    const foodEmojis = [
        "🍕", "🍔", "🍟", "🌭", "🍿", "🥟", "🍜", "🍗",
        "🥪", "🍩", "🍪", "🍰", "🍫", "☕", "🍺", "🍭",
    ];

    let shuffledEmojis = [];
    let currentIndex = 0;
    let intervalId = null;

    function shuffle(array) {
        const newArr = array.slice();
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    function animateBubble() {
        const bubble = document.querySelector('.note-bubble');
        if (bubble) {
            bubble.classList.remove('animate');
            void bubble.offsetWidth;
            bubble.classList.add('animate');
        }
    }

    function updateEmoji() {
        if (currentIndex >= shuffledEmojis.length) {
            shuffledEmojis = shuffle(foodEmojis);
            currentIndex = 0;
        }
        const emojiSpan = document.querySelector('.emoji');
        if (emojiSpan) {
            emojiSpan.textContent = shuffledEmojis[currentIndex];
            emojiSpan.parentElement.style.visibility = 'visible';
            currentIndex++;
            animateBubble();
            saveState();
        }
    }

    function saveState() {
        const emojiSpan = document.querySelector('.emoji');
        if (emojiSpan) {
            window.foodRandomState = {
                currentEmoji: emojiSpan.textContent
            };
        }
    }

    function restoreState() {
        const emojiSpan = document.querySelector('.emoji');
        if (!emojiSpan || !window.foodRandomState) return false;

        emojiSpan.textContent = window.foodRandomState.currentEmoji;
        emojiSpan.parentElement.style.visibility = 'visible';
        return true;
    }

    window.stopFoodRandom = function () {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            saveState();
        }
    };

    function setupManualDragAndDrop() {
        const bubble = document.querySelector('.note-bubble');
        const emojiSpan = document.querySelector('.emoji');
        const dropZone = document.querySelector('#dropZone');
        const capooImage = document.querySelector('#capooImage');

        if (!bubble || !emojiSpan || !dropZone || !capooImage) return;

        let isDragging = false;
        let dragElement = null;

        emojiSpan.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;

            dragElement = document.createElement('div');
            dragElement.className = 'dragging-emoji';
            dragElement.textContent = emojiSpan.textContent;
            document.body.appendChild(dragElement);

            const rect = emojiSpan.getBoundingClientRect();
            dragElement.style.left = `${rect.left}px`;
            dragElement.style.top = `${rect.top}px`;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && dragElement) {
                dragElement.style.left = `${e.clientX - 10}px`;
                dragElement.style.top = `${e.clientY - 10}px`;
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging && dragElement) {
                isDragging = false;

                const dropRect = dropZone.getBoundingClientRect();
                const dropX = e.clientX;
                const dropY = e.clientY;

                if (
                    dropX >= dropRect.left &&
                    dropX <= dropRect.right &&
                    dropY >= dropRect.top &&
                    dropY <= dropRect.bottom
                ) {
                    const draggedContent = dragElement.textContent;
                    // Kiểm tra xem nội dung kéo có trong foodEmojis không
                    if (foodEmojis.includes(draggedContent)) {
                        bubble.style.visibility = 'hidden';
                        // emojiSpan.textContent = '❤️'; // Comment nếu không dùng
                        capooImage.src = 'img/capoo-full.webp';
                        window.stopFoodRandom();
                    }
                }

                document.body.removeChild(dragElement);
                dragElement = null;
            }
        });

        emojiSpan.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDragging = true;

            dragElement = document.createElement('div');
            dragElement.className = 'dragging-emoji';
            dragElement.textContent = emojiSpan.textContent;
            document.body.appendChild(dragElement);

            const touch = e.touches[0];
            const rect = emojiSpan.getBoundingClientRect();
            dragElement.style.left = `${rect.left}px`;
            dragElement.style.top = `${rect.top}px`;
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging && dragElement) {
                const touch = e.touches[0];
                dragElement.style.left = `${touch.clientX - 10}px`;
                dragElement.style.top = `${touch.clientY - 10}px`;
            }
        });

        document.addEventListener('touchend', (e) => {
            if (isDragging && dragElement) {
                isDragging = false;

                const touch = e.changedTouches[0];
                const dropRect = dropZone.getBoundingClientRect();
                const dropX = touch.clientX;
                const dropY = touch.clientY;

                if (
                    dropX >= dropRect.left &&
                    dropX <= dropRect.right &&
                    dropY >= dropRect.top &&
                    dropY <= dropRect.bottom
                ) {
                    const draggedContent = dragElement.textContent;
                    // Kiểm tra xem nội dung kéo có trong foodEmojis không
                    if (foodEmojis.includes(draggedContent)) {
                        bubble.style.visibility = 'hidden';
                        // emojiSpan.textContent = '❤️'; // Comment nếu không dùng
                        capooImage.src = 'img/capoo-full.webp';
                        window.stopFoodRandom();
                    }
                }

                document.body.removeChild(dragElement);
                dragElement = null;
            }
        });
    }

    const bubble = document.querySelector('.note-bubble');
    if (bubble) {
        if (window.foodRandomInterval) {
            clearInterval(window.foodRandomInterval);
        }

        shuffledEmojis = shuffle(foodEmojis);

        const isRestored = restoreState();

        if (!isRestored) {
            bubble.style.visibility = 'hidden';
            const delay = 1000 + Math.random() * 2000;
            setTimeout(() => {
                updateEmoji();
                intervalId = window.foodRandomInterval = setInterval(updateEmoji, 60 * 1000);
            }, delay);
        } else {
            intervalId = window.foodRandomInterval = setInterval(updateEmoji, 60 * 1000);
        }

        setupManualDragAndDrop();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initFoodRandom();
});

window.initFoodRandom = initFoodRandom;