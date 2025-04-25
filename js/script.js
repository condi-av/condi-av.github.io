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
    } else {
      throw new Error('Ошибка отправки');
    }
    
  } catch (error) {
    messages.className = 'error';
    messages.innerHTML = `
      <i class="fas fa-exclamation-circle"></i> 
      Ошибка отправки. Пожалуйста, позвоните нам напрямую.
    `;
  }
  
  messages.scrollIntoView({ behavior: 'smooth' });
});

// Подсказка для телефона
phoneInput.addEventListener('focus', function() {
  if (!this.value) {
    this.value = '+7 (';
  }
});

/* Футер и карта сайта */
.footer-links {
  margin: 15px 0;
}

.footer-links a {
  color: #ccc;
  margin: 0 10px;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #007bff;
  text-decoration: underline;
}
