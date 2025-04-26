// Маска для телефона
document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    // Инициализация маски для телефона
    const phoneMask = IMask(phoneInput, {
      mask: '+{7} (000) 000-00-00'
    });

    // Подсказка для телефона
    phoneInput.addEventListener('focus', function() {
      if (!this.value) {
        phoneMask.value = '+7 (';
      }
    });

    ymaps.ready(function() {
           var map = new ymaps.Map("map", {
               center: [55.692252, 37.924886],
               zoom: 15
           });
           // Добавление метки
           var placemark = new ymaps.Placemark([55.692252, 37.924886], {
               hintContent: 'AC Service',
               balloonContent: 'г. Москва, ул. Люберка, 1/1А'
           });
           map.geoObjects.add(placemark);
       });
    
    // Валидация телефона при потере фокуса
    phoneInput.addEventListener('blur', function() {
      if (this.value.length < 15) { // +7 (XXX) XXX-XX-XX = 15 символов
        this.setCustomValidity('Пожалуйста, введите полный номер телефона');
      } else {
        this.setCustomValidity('');
      }
    });
  }

  // Обработка формы
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const form = e.target;
      const formData = new FormData(form);
      const messages = document.getElementById('formMessages');
      const submitBtn = form.querySelector('button[type="submit"]');

fetch(form.action, {
  method: 'POST',
  body: formData
}).then(response => {
  if (response.ok) {
    ym(66049414, 'reachGoal', 'FORM_SUBMIT'); // Отправка цели
  }
})
      
      // Показываем индикатор загрузки
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
      
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          messages.className = 'success';
          messages.innerHTML = `
            <i class="fas fa-check-circle"></i> 
            Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение 15 минут.
          `;
          form.reset();
          
          // Сброс маски телефона после успешной отправки
          if (phoneMask) {
            phoneMask.value = '';
          }
        } else {
          throw new Error('Ошибка отправки формы');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        messages.className = 'error';
        messages.innerHTML = `
          <i class="fas fa-exclamation-circle"></i> 
          Ошибка отправки. Пожалуйста, позвоните нам напрямую или попробуйте позже.
        `;
      } finally {
        // Восстанавливаем кнопку
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Записаться сейчас';
        
        // Прокрутка к сообщению
        messages.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Автоматическое скрытие сообщения через 10 секунд
        setTimeout(() => {
          messages.style.opacity = '0';
          setTimeout(() => {
            messages.style.display = 'none';
            messages.style.opacity = '1';
          }, 500);
        }, 10000);
      }
    });
  }
});

// Анимация для кнопок навигации
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

// В конец существующего скрипта добавить:
document.addEventListener('DOMContentLoaded', function() {
  const burger = document.querySelector('.burger-menu');
  const nav = document.querySelector('.nav-links');

  // Открытие/закрытие меню
  burger.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Закрытие меню при клике на ссылку
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // Закрытие меню при клике вне области
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
      burger.classList.remove('active');
      nav.classList.remove('active');
    }
  });
});
// В конец script.js
document.querySelector('.show-all-reviews').addEventListener('click', function() {
  this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
  
  // Здесь может быть запрос к API для подгрузки отзывов
  setTimeout(() => {
    this.style.display = 'none';
    document.querySelectorAll('.review-card.hidden').forEach(card => {
      card.style.display = 'block';
    });
  }, 1000);
});
