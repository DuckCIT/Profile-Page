// Hàm mở modal với hiệu ứng scale
function showModalHandler() {
    const modal = document.getElementById('questionModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active'); // Thêm class active để kích hoạt hiệu ứng
    }, 10); // Delay nhỏ để transition hoạt động
}

// Hàm đóng modal với hiệu ứng scale
function closeModalHandler() {
    const modal = document.getElementById('questionModal');
    modal.classList.remove('active'); // Xóa class active để thu nhỏ
    setTimeout(() => {
        modal.style.display = 'none'; // Ẩn sau khi hiệu ứng hoàn tất
    }, 300); // Thời gian khớp với transition (0.3s)
}

function initModal() {
    const askQuestionLink = document.getElementById('askQuestion');
    const questionModal = document.getElementById('questionModal');
    const closeModal = document.getElementById('closeModal');
    const questionForm = document.getElementById('questionForm');
    const loading = document.getElementById('loading');

    if (!askQuestionLink || !questionModal || !closeModal || !questionForm || !loading) {
        console.error("Thiếu phần tử DOM cần thiết cho modal!");
        return;
    }

    // Gắn sự kiện mở modal
    askQuestionLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModalHandler();
    });

    // Gắn sự kiện đóng modal
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

// Hàm mở modal
function openDonateModal() {
    const modal = document.getElementById("donateModal");
    if (modal) {
        modal.style.display = "flex";
        setTimeout(() => {
            modal.classList.add("active"); // Thêm class active để kích hoạt hiệu ứng
        }, 10); // Delay nhỏ để transition hoạt động
    }
}

// Hàm đóng modal
function closeDonateModal() {
    const modal = document.getElementById("donateModal");
    if (modal) {
        modal.classList.remove("active"); // Xóa class active để thu nhỏ
        setTimeout(() => {
            modal.style.display = "none"; // Ẩn sau khi hiệu ứng hoàn tất
        }, 300); // Thời gian khớp với transition (0.3s)
    }
}

// Hàm khởi tạo modal
function initDonateModal() {
    const donateButton = document.getElementById("donate");
    const closeDonateModalBtn = document.getElementById("closeDonateModal");
    const donateModal = document.getElementById("donateModal");

    // Kiểm tra sự tồn tại của các phần tử, nếu thiếu thì bỏ qua
    if (!donateButton || !closeDonateModalBtn || !donateModal) {
        return;
    }

    // Gắn sự kiện cho nút Donate
    donateButton.addEventListener("click", function(e) {
        e.preventDefault();
        openDonateModal();
    });

    // Gắn sự kiện cho nút đóng
    closeDonateModalBtn.addEventListener("click", function() {
        closeDonateModal();
    });

    // Đóng khi nhấn bên ngoài modal
    donateModal.addEventListener("click", function(e) {
        if (e.target === this) {
            closeDonateModal();
        }
    });
}

// Chạy khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", function() {
    initDonateModal();
});