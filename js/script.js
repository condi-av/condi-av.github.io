document.addEventListener('DOMContentLoaded', function() {
  // Обработка формы
  document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const messageElement = document.getElementById('formMessage');

    if(name && phone && service && date && time) {
      // Здесь можно добавить отправку данных на сервер
      messageElement.textContent = `Спасибо, ${name}! Ваша заявка на "${service}" принята. Мы свяжемся с вами для подтверждения.`;
      messageElement.style.color = 'green';
      document.getElementById('appointmentForm').reset();
      
      // Сохраняем данные в localStorage
      const appointment = {
        name: name,
        phone: phone,
        service: service,
        date: date,
        time: time,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastAppointment', JSON.stringify(appointment));
    } else {
      messageElement.textContent = 'Пожалуйста, заполните все поля.';
      messageElement.style.color = 'red';
    }
  });

  // Плавная прокрутка для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});