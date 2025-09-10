document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('telegramForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const carModel = document.getElementById('carModel').value;
        const phone = document.getElementById('phone').value;
        
        // Токен бота и ID чата
        const botToken = 'bot7973323851:AAHq5QHx6j8yEkqCOerWCxAFgT0hRGLL6zY';
        const chatId = '5414933430';
        
        // Формируем сообщение
        const message = `🔥НОВАЯ ЗАЯВКА🔥\n☃️Имя: ${name}\n🚙Модель автомобиля: ${carModel}\n☎️Телефон: ${phone}`;
        
        // Отправляем сообщение в Telegram
        fetch(`https://api.telegram.org/${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                form.reset();
            } else {
                alert('Произошла ошибка при отправке заявки. Пожалуйста, позвоните нам по телефону.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке заявки. Пожалуйста, позвоните нам по телефону.');
        });
    });
});