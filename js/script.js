// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карты
    if (typeof ymaps !== 'undefined') {
        initMap();
    } else {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=6a008034-faa2-4fb0-8d62-671062ab8aaf&lang=ru_RU';
        script.onload = function() {
            ymaps.ready(initMap);
        };
        document.head.appendChild(script);
    }

    // Инициализация маски для телефона
    const phoneInput = document.getElementById('phone');
    const phoneMask = new IMask(phoneInput, {
        mask: '+{7} (000) 000-00-00',
        lazy: false,
        placeholderChar: '_'
    });

    // Бургер-меню
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-links');
    
    burger.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        this.setAttribute('aria-expanded', this.classList.contains('active'));
    });

    // Обработка формы
    const form = document.getElementById('appointmentForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        
        // Здесь должна быть реальная отправка формы
        setTimeout(function() {
            alert('Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.');
            form.reset();
            phoneMask.updateValue();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
        }, 1500);
    });
});

// Функция инициализации карты
function initMap() {
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
