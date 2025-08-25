// blog.js - функционал для страницы блога
document.addEventListener('DOMContentLoaded', function() {
    initCommentForm();
    initRatingStars();
    initScrollToComments();
});

// Инициализация формы комментариев
function initCommentForm() {
    const commentForm = document.querySelector('.comment-form');
    if (!commentForm) return;

    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const rating = document.querySelector('.stars-input i.active')?.dataset.rating || 0;
        
        if (rating < 1) {
            showMessage('Пожалуйста, поставьте оценку', 'error');
            return;
        }

        // Здесь будет отправка на сервер
        showMessage('Ваш отзыв отправлен на модерацию', 'success');
        this.reset();
        resetStars();
    });
}

// Рейтинг звездочками
function initRatingStars() {
    const stars = document.querySelectorAll('.stars-input i');
    if (!stars.length) return;

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            setRating(stars, rating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(stars, rating);
        });
        
        star.addEventListener('mouseleave', function() {
            const activeRating = document.querySelector('.stars-input i.active')?.dataset.rating || 0;
            highlightStars(stars, activeRating);
        });
    });
}

function setRating(stars, rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        star.classList.toggle('active', starRating <= rating);
        star.classList.toggle('far', starRating > rating);
        star.classList.toggle('fas', starRating <= rating);
    });
}

function highlightStars(stars, rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        star.style.color = starRating <= rating ? '#f1c40f' : '#ddd';
    });
}

function resetStars() {
    const stars = document.querySelectorAll('.stars-input i');
    stars.forEach(star => {
        star.classList.remove('active', 'fas');
        star.classList.add('far');
        star.style.color = '#ddd';
    });
}

// Прокрутка к комментариям
function initScrollToComments() {
    const hash = window.location.hash;
    if (hash === '#comments') {
        setTimeout(() => {
            const commentsSection = document.querySelector('.comments-section');
            if (commentsSection) {
                commentsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
}

// Вспомогательные функции
function showMessage(text, type) {
    // Создаем и показываем сообщение
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
        ${text}
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Отслеживание просмотров
if (typeof ym !== 'undefined') {
    ym(66049414, 'reachGoal', 'BLOG_POST_VIEW');
}