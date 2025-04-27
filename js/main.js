// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карты
    initYandexMap();
    
    // Инициализация маски для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        initPhoneMask(phoneInput);
    }

    // Бургер-меню
    initBurgerMenu();

    // Обработка формы
    const form = document.getElementById('appointmentForm');
    if (form) {
        initForm(form);
    }

    // Плавная прокрутка для навигации
    initSmoothScroll();
});

// Функция инициализации карты
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

// Инициализация маски телефона
function initPhoneMask(phoneInput) {
    const phoneMask = new IMask(phoneInput, {
        mask: '+{7} (000) 000-00-00',
        lazy: false,
        placeholderChar: '_'
    });

    phoneInput.addEventListener('focus', function() {
        if (!this.value) {
            phoneMask.value = '+7 (';
        }
    });

    phoneInput.addEventListener('blur', function() {
        if (this.value.length < 15) {
            this.setCustomValidity('Пожалуйста, введите полный номер телефона');
        } else {
            this.setCustomValidity('');
        }
    });
}

// Инициализация бургер-меню
function initBurgerMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-links');
    
    if (!burger || !nav) return;

    burger.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        this.setAttribute('aria-expanded', this.classList.contains('active'));
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    // Закрытие меню при клике вне области
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
            burger.classList.remove('active');
            nav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Инициализация формы
function initForm(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const messages = document.getElementById('formMessages') || createFormMessages();

        // Показываем индикатор загрузки
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        
        try {
            // Здесь должна быть реальная отправка формы
            const response = await mockFormSubmit(formData);

            if (response.ok) {
                showSuccessMessage(messages);
                form.reset();
                
                // Отправка цели в Яндекс.Метрику
                if (typeof ym !== 'undefined') {
                    ym(66049414, 'reachGoal', 'FORM_SUBMIT');
                }
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (error) {
            showErrorMessage(messages, error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
            messages.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Мок-функция для отправки формы (замените на реальный fetch)
function mockFormSubmit(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Форма отправлена:', Object.fromEntries(formData));
            resolve({ ok: true });
        }, 1500);
    });
}

function createFormMessages() {
    const div = document.createElement('div');
    div.id = 'formMessages';
    document.querySelector('.contact-form').appendChild(div);
    return div;
}

function showSuccessMessage(el) {
    el.className = 'success';
    el.innerHTML = `
        <i class="fas fa-check-circle"></i> 
        Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение 15 минут.
    `;
    hideMessageAfterTimeout(el);
}

function showErrorMessage(el, error) {
    console.error('Form submission error:', error);
    el.className = 'error';
    el.innerHTML = `
        <i class="fas fa-exclamation-circle"></i> 
        Ошибка отправки. Пожалуйста, позвоните нам напрямую или попробуйте позже.
    `;
    hideMessageAfterTimeout(el);
}

function hideMessageAfterTimeout(el, timeout = 10000) {
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.display = 'none';
            el.style.opacity = '1';
        }, 500);
    }, timeout);
}

// Плавная прокрутка
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
