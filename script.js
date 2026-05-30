async function sendToEmail(food, time, hobby) {
    const email = 'georgijbogdan827@gmail.com'; // 👈 ЗАМЕНИТЕ НА СВОЙ EMAIL

    const data = {
        '🥗 Любимое блюдо': food,
        '⏰ Время забора': time + ':00',
        '🎯 Чем заняться': hobby,
        '_subject': '🆕 НОВАЯ ЗАЯВКА НА СВИДАНИЕ 🆕',
        '_captcha': 'false'
    };

    try {
        const response = await fetch('https://formsubmit.co/ajax/' + email, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            return true;
        } else {
            console.error('Ошибка FormSubmit:', result);
            return false;
        }
    } catch (error) {
        console.error('Ошибка отправки email:', error);
        return false;
    }
}

// ========== ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ==========
const buttons = document.querySelectorAll('[data-page]');
const pages = document.querySelectorAll('.page');

function switchPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    const activePage = document.getElementById(pageId);
    if (activePage) activePage.classList.add('active');
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const pageId = button.getAttribute('data-page');
        window.location.hash = pageId;
        switchPage(pageId);
    });
});

function handleHashChange() {
    let hash = window.location.hash.slice(1);
    if (!hash || !document.getElementById(hash)) hash = 'home';
    switchPage(hash);
}

// ========== ОБРАБОТКА ФОРМЫ ==========
document.addEventListener('DOMContentLoaded', () => {
    handleHashChange();

    const submitBtn = document.getElementById('submitQuiz');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const selectedFood = document.querySelector('input[name="food"]:checked');
            const selectedTime = document.querySelector('input[name="music"]:checked');
            const selectedHobby = document.querySelector('input[name="hobby"]:checked');

            if (selectedFood && selectedTime && selectedHobby) {
                const food = selectedFood.value;
                const time = selectedTime.value;
                const hobby = selectedHobby.value;

                const sent = await sendToEmail(food, time, hobby);

                if (sent) {
                    document.getElementById('quizResult').innerHTML = 
                        `❤️ Thank you, dear! I will take into account what you want ${food}, ready at ${time}:00, and you like ${hobby}. Get ready for the best date ever! ❤️<br><small>(Я получил твои ответы на почту и скоро напишу!)</small>`;
                } else {
                    document.getElementById('quizResult').innerHTML = 
                        `❤️ Thank you, dear! Your answers have been saved. ❤️<br><small>(Не удалось отправить на почту, но я увижу их в консоли браузера.)</small>`;
                    console.log({ food, time, hobby });
                }
            } else {
                document.getElementById('quizResult').innerHTML = 
                    '💌 Please choose an answer for all three questions, dear 💌';
            }
        });
    }
});

window.addEventListener('hashchange', handleHashChange);