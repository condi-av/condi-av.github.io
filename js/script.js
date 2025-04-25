// Маска для телефона
const phoneInput = document.getElementById('phone');
IMask(phoneInput, {
  mask: '+{7} (000) 000-00-00'
});

// Обработка формы
document.getElementById('appointmentForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const messages = document.getElementById('formMessages');
  
  try {
    // Здесь должна быть реальная отправка на сервер
    // Например через fetch или Formspree
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
    
    messages.className = 'success';
    messages.innerHTML = `
      <i class="fas fa-check-circle"></i> 
      Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение 15 минут.
    `;
    
    form.reset();
    
    // Отправка в Google Analytics
    if (window.gtag) {
      gtag('event', 'conversion', {'send_to': 'AW-123456789/AbCd-EFGhIjK'});
    }
    
  } catch (error) {
    messages.className = 'error';
    messages.innerHTML = `
      <i class="fas fa-exclamation-circle"></i> 
      Ошибка отправки. Пожалуйста, попробуйте ещё раз или позвоните нам.
    `;
  }
  
  // Прокрутка к сообщению
  messages.scrollIntoView({ behavior: 'smooth' });
});

// Подсказка при фокусе на поле телефона
phoneInput.addEventListener('focus', function() {
  if (!this.value) {
    this.value = '+7 (';
  }
});
