// Question modal handlers
function showModalHandler() {
    const modal = document.getElementById('questionModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeModalHandler() {
    const modal = document.getElementById('questionModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Initialize question modal and form handling
function initModal() {
    const askQuestionLink = document.getElementById('askQuestion');
    const questionModal = document.getElementById('questionModal');
    const closeModal = document.getElementById('closeModal');
    const questionForm = document.getElementById('questionForm');
    const loading = document.getElementById('loading');

    if (!askQuestionLink || !questionModal || !closeModal || !questionForm || !loading) return;

    askQuestionLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModalHandler();
    });

    closeModal.addEventListener('click', closeModalHandler);

    questionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loading.style.display = 'flex';

        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        const closeNotification = document.getElementById('closeNotification');

        const formData = new FormData(questionForm);
        const jsonData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("https://formspree.io/f/mldjwyyd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData)
            });

            loading.style.display = 'none';

            if (response.ok) {
                notificationMessage.textContent = translations[currentLang].submitButton === "Send question"
                    ? "Thank you for your question! I will respond as soon as possible."
                    : "Cảm ơn bạn đã gửi câu hỏi! Tôi sẽ trả lời sớm nhất có thể.";
                notification.classList.add('success');
                notification.classList.remove('error');
            } else {
                throw new Error("Failed to submit.");
            }
        } catch (error) {
            loading.style.display = 'none';
            notificationMessage.textContent = translations[currentLang].submitButton === "Send question"
                ? "Something went wrong! Please try again later."
                : "Có lỗi xảy ra! Vui lòng thử lại sau.";
            notification.classList.add('error');
            notification.classList.remove('success');
        }

        notification.classList.remove('hidden');

        const hideTimeout = setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);

        if (!closeNotification.hasAttribute('data-listener-added')) {
            closeNotification.addEventListener('click', () => {
                clearTimeout(hideTimeout);
                notification.classList.add('hidden');
            });
            closeNotification.setAttribute('data-listener-added', 'true');
        }

        questionForm.reset();
        closeModalHandler();
    });
}

document.addEventListener('DOMContentLoaded', initModal);

// Donate modal handlers
function openDonateModal() {
    const modal = document.getElementById("donateModal");
    if (modal) {
        modal.style.display = "flex";
        setTimeout(() => {
            modal.classList.add("active");
        }, 10);
    }
}

function closeDonateModal() {
    const modal = document.getElementById("donateModal");
    if (modal) {
        modal.classList.remove("active");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }
}

// Initialize donate modal
function initDonateModal() {
    const donateButton = document.getElementById("donate");
    const closeDonateModalBtn = document.getElementById("closeDonateModal");
    const donateModal = document.getElementById("donateModal");

    if (!donateButton || !closeDonateModalBtn || !donateModal) return;

    donateButton.addEventListener("click", function(e) {
        e.preventDefault();
        openDonateModal();
    });

    closeDonateModalBtn.addEventListener("click", function() {
        closeDonateModal();
    });

    donateModal.addEventListener("click", function(e) {
        if (e.target === this) {
            closeDonateModal();
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    initDonateModal();
});