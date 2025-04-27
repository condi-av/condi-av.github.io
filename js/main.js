// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initYandexMap();
    initPhoneMask();
    initBurgerMenu();
    initForm();
    initSmoothScroll();
});

// Функция инициализации карты (без изменений)
function initYandexMap() {
    if (typeof ymaps === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=6a008034-faa2-4fb0-8d62-671062ab8aaf&lang=ru_RU';
        script.onload = function() {
            ymaps.ready(createMap);
        };
        document.head.appendChild(script);
    } else {
        ymaps.ready(createMap);
    }
}

function createMap() {
    const map = new ymaps.Map('map', {
        center: [55.692252, 37.924886],
        zoom: 16,
        controls: ['zoomControl', 'fullscreenControl']
    });
    
    const placemark = new ymaps.Placemark([55.692252, 37.924886], {
        hintContent: 'AC Service',
        balloonContent: 'Сервис автокондиционеров'
    }, {
        iconLayout: 'default#image',
        iconImageHref: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
        iconImageSize: [48, 48],
        iconImageOffset: [-24, -48]
    });
    
    map.geoObjects.add(placemark);
    map.behaviors.disable('scrollZoom');
}

// Инициализация маски телефона (оптимизированная)
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    const phoneMask = new IMask(phoneInput, {
        mask: '+{7} (000) 000-00-00',
        lazy: false,
        placeholderChar: '_'
    });

    phoneInput.addEventListener('focus', function() {
        if (!this.value) phoneMask.value = '+7 (';
    });

    phoneInput.addEventListener('blur', function() {
        this.setCustomValidity(this.value.length < 15 ? 'Введите полный номер' : '');
    });
}

// Бургер-меню (без изменений)
function initBurgerMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-links');
    
    if (!burger || !nav) return;

    burger.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        this.setAttribute('aria-expanded', this.classList.contains('active'));
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
            burger.classList.remove('active');
            nav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Инициализация формы с Formspree
function initForm() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const messages = createMessageContainer();

        // Валидация телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput.value.length < 15) {
            showMessage(messages, 'error', 'Введите полный номер телефона');
            return;
        }

        // Показываем индикатор загрузки
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

        try {
            const response = await fetch('https://formspree.io/f/mqaqaezj', {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showMessage(messages, 'success', '✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.');
                form.reset();
                
                // Яндекс.Метрика
                if (typeof ym !== 'undefined') {
                    ym(66049414, 'reachGoal', 'FORM_SENT');
                }
            } else {
                throw new Error(await response.text());
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showMessage(messages, 'error', '⚠️ Ошибка при отправке. Позвоните нам: +7 (916) 444-93-71');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Вспомогательные функции для формы
function createMessageContainer() {
    let container = document.getElementById('form-messages');
    if (!container) {
        container = document.createElement('div');
        container.id = 'form-messages';
        document.querySelector('.contact-form').prepend(container);
    }
    return container;
}

function showMessage(container, type, text) {
    container.className = `message ${type}`;
    container.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
        ${text}
    `;
    setTimeout(() => {
        container.style.opacity = '0';
        setTimeout(() => container.remove(), 500);
    }, 5000);
}

// Плавающая кнопка телефона с анимацией
document.addEventListener('DOMContentLoaded', function() {
  const callBtn = document.querySelector('.floating-call-btn');
  
  // Анимация пульсации при загрузке
  callBtn.classList.add('pulse');
  
  // Останавливаем пульсацию при наведении
  callBtn.addEventListener('mouseenter', function() {
    this.classList.remove('pulse');
  });
  
  // Возвращаем пульсацию, когда курсор убран
  callBtn.addEventListener('mouseleave', function() {
    this.classList.add('pulse');
  });
  
  // Останавливаем пульсацию после клика
  callBtn.addEventListener('click', function() {
    this.classList.remove('pulse');
  });
});

// Плавная прокрутка (без изменений)
function initSmoothScroll() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}
