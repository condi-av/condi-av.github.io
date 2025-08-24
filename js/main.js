// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initYandexMap();
    initPhoneMask();
    initBurgerMenu();
    initForm();
    initSmoothScroll();
    initFloatingButtons();
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
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    try {
        const map = new ymaps.Map('map', {
            center: [55.726548, 37.867609],
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl']
        });
        
        const placemark = new ymaps.Placemark([55.726548, 37.867609], {
            hintContent: 'AC Service',
            balloonContent: 'Сервис автокондиционеров<br>Замена R744 на R134a'
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
            iconImageSize: [48, 48],
            iconImageOffset: [-24, -48]
        });
        
        map.geoObjects.add(placemark);
        map.behaviors.disable('scrollZoom');
    } catch (error) {
        console.error('Ошибка при создании карты:', error);
    }
}

// Инициализация маски телефона
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    try {
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
    } catch (error) {
        console.error('Ошибка при инициализации маски телефона:', error);
    }
}

// Бургер-меню
function initBurgerMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-links');
    
    if (!burger || !nav) return;

    burger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        nav.classList.toggle('active');
        this.setAttribute('aria-expanded', this.classList.contains('active'));
    });

    // Закрытие меню по клику на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    // Закрытие меню по клику вне его области
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
            burger.classList.remove('active');
            nav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        }
    });

    // Закрытие меню при скролле
    window.addEventListener('scroll', function() {
        if (nav.classList.contains('active')) {
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
        if (phoneInput && phoneInput.value.length < 15) {
            showMessage(messages, 'error', 'Введите полный номер телефона');
            phoneInput.focus();
            return;
        }

        // Валидация выбора услуги
        const serviceSelect = document.getElementById('service');
        if (serviceSelect && !serviceSelect.value) {
            showMessage(messages, 'error', 'Пожалуйста, выберите услугу');
            serviceSelect.focus();
            return;
        }

        // Показываем индикатор загрузки
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

        try {
            const formData = new FormData(form);
            
            // Добавляем дополнительную информацию о посетителе
            formData.append('Страница', window.location.href);
            formData.append('User Agent', navigator.userAgent);
            formData.append('Время отправки', new Date().toLocaleString('ru-RU'));

            const response = await fetch('https://formspree.io/f/mqaqaezj', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showMessage(messages, 'success', '✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.');
                form.reset();
                
                // Яндекс.Метрика - цель для новой услуги
                if (typeof ym !== 'undefined') {
                    const selectedService = serviceSelect ? serviceSelect.value : '';
                    if (selectedService.includes('R744')) {
                        ym(66049414, 'reachGoal', 'R744_CONVERSION_FORM');
                    } else {
                        ym(66049414, 'reachGoal', 'FORM_SENT');
                    }
                }

                // Google Analytics (если используется)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'contact',
                        'event_label': 'Новая заявка с сайта'
                    });
                }

            } else {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            showMessage(messages, 'error', '⚠️ Ошибка при отправке. Позвоните нам: +7 (916) 444-93-71');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    // Добавляем отслеживание выбора услуги R744
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            if (this.value.includes('R744') && typeof ym !== 'undefined') {
                ym(66049414, 'reachGoal', 'R744_SERVICE_SELECTED');
            }
        });
    }
}

// Вспомогательные функции для формы
function createMessageContainer() {
    let container = document.getElementById('form-messages');
    if (!container) {
        container = document.createElement('div');
        container.id = 'form-messages';
        const form = document.querySelector('.contact-form');
        if (form) {
            form.insertBefore(container, form.firstChild);
        }
    }
    container.innerHTML = '';
    return container;
}

function showMessage(container, type, text) {
    container.className = `message ${type}`;
    container.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
        ${text}
    `;
    container.style.opacity = '1';
    
    setTimeout(() => {
        container.style.opacity = '0';
        setTimeout(() => {
            container.innerHTML = '';
            container.className = '';
        }, 500);
    }, 5000);
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('nav a, .floating-scroll-top').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.main-nav').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Обновляем URL без прыжка
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// Плавающие кнопки
function initFloatingButtons() {
    const callBtn = document.querySelector('.floating-call-btn');
    const whatsappBtn = document.querySelector('.floating-whatsapp-btn');
    
    if (callBtn) {
        // Анимация пульсации при загрузке
        callBtn.classList.add('pulse');
        
        callBtn.addEventListener('mouseenter', function() {
            this.classList.remove('pulse');
        });
        
        callBtn.addEventListener('mouseleave', function() {
            this.classList.add('pulse');
        });
        
        callBtn.addEventListener('click', function() {
            this.classList.remove('pulse');
            if (typeof ym !== 'undefined') {
                ym(66049414, 'reachGoal', 'FLOATING_CALL_CLICK');
            }
        });
    }
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            if (typeof ym !== 'undefined') {
                ym(66049414, 'reachGoal', 'WHATSAPP_CLICK');
            }
        });
    }
    
    // Кнопка "Наверх"
    createScrollToTopButton();
}

// Создание кнопки "Наверх"
function createScrollToTopButton() {
    const scrollBtn = document.createElement('a');
    scrollBtn.href = '#top';
    scrollBtn.className = 'floating-scroll-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Наверх');
    
    document.body.appendChild(scrollBtn);
    
    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 1000) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Стили для кнопки "Наверх"
    const style = document.createElement('style');
    style.textContent = `
        .floating-scroll-top {
            position: fixed;
            bottom: 90px;
            right: 20px;
            background: linear-gradient(to right, #3498db, #2980b9);
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            z-index: 9998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            text-decoration: none;
            opacity: 0;
            visibility: hidden;
        }
        
        .floating-scroll-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        
        @media (max-width: 768px) {
            .floating-scroll-top {
                bottom: 160px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Инициализация галереи
function initGallery() {
    if (typeof $.fancybox !== 'undefined' && $('.gallery-container').length) {
        $('[data-fancybox="gallery"]').fancybox({
            buttons: [
                "slideShow",
                "thumbs",
                "zoom",
                "fullScreen",
                "share",
                "close"
            ],
            loop: true,
            protect: true,
            animationEffect: "fade",
            transitionEffect: "slide",
            afterLoad: function(instance, current) {
                // Отслеживание просмотра галереи в аналитике
                if (typeof ym !== 'undefined') {
                    ym(66049414, 'reachGoal', 'GALLERY_VIEW');
                }
            }
        });
        
        // Отслеживание кликов по изображениям галереи
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                if (typeof ym !== 'undefined') {
                    ym(66049414, 'reachGoal', 'GALLERY_CLICK');
                }
            });
        });
    }
}

// Ленивая загрузка изображений
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Оптимизация производительности
function initPerformanceOptimization() {
    // Отложенная загрузка не критичных ресурсов
    setTimeout(() => {
        initGallery();
        initLazyLoading();
    }, 1000);
    
    // Обработка ошибок
    window.addEventListener('error', function(e) {
        console.error('Произошла ошибка:', e.error);
    });
    
    // Отслеживание скорости загрузки
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            if (loadTime > 3000) {
                console.warn('Время загрузки страницы:', loadTime + 'ms');
            }
        });
    }
}

// Инициализация всего после полной загрузки
window.addEventListener('load', function() {
    initPerformanceOptimization();
    
    // Добавляем класс для анимаций после загрузки
    document.body.classList.add('loaded');
});
