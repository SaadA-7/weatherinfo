document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('searchForm');
  const weatherResult = document.getElementById('weatherResult');
  const errorMessage = document.getElementById('errorMessage');

  searchForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const city = document.getElementById('cityInput').value;
    
    weatherResult.classList.remove('show');
    errorMessage.classList.remove('show');

    try {
      const response = await fetch('/api/weather/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ city })
      });

      const data = await response.json();

      if (data.success) {
        document.getElementById('cityName').textContent = 
          `${data.data.city}, ${data.data.country}`;
        document.getElementById('temperature').textContent = 
          `Temperature: ${data.data.temperature}°F`;
        document.getElementById('description').textContent = 
          `Conditions: ${data.data.description}`;
        document.getElementById('humidity').textContent = 
          `Humidity: ${data.data.humidity}%`;
        document.getElementById('windSpeed').textContent = 
          `Wind Speed: ${data.data.windSpeed} mph`;
        
        weatherResult.classList.add('show');
      } else {
        errorMessage.textContent = data.message;
        errorMessage.classList.add('show');
      }
    } catch (error) {
      errorMessage.textContent = 'Error connecting to server';
      errorMessage.classList.add('show');
    }
  });
});