document.addEventListener('DOMContentLoaded', async function() {
  const historyContainer = document.getElementById('historyContainer');

  try {
    const response = await fetch('/api/weather/history');
    const data = await response.json();

    if (data.success && data.data.length > 0) {
      let html = '';

      data.data.forEach(city => {
        const date = new Date(city.searchedAt).toLocaleString();
        html += `
          <div class="history-item">
            <h3>${city.cityName}, ${city.country}</h3>
            <p>Temperature: ${city.temperature}°F</p>
            <p>Conditions: ${city.description}</p>
            <p>Humidity: ${city.humidity}%</p>
            <p>Wind Speed: ${city.windSpeed} mph</p>
            <p>Searched: ${date}</p>
          </div>
        `;
      });

      html += '<button id="clearBtn" class="clear-btn">Clear All History</button>';
      historyContainer.innerHTML = html;

      document.getElementById('clearBtn').addEventListener('click', async function() {
        if (confirm('Are you sure you want to clear all history?')) {
          try {
            const response = await fetch('/api/weather/clear', {
              method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
              location.reload();
            }
          } catch (error) {
            alert('Error clearing history');
          }
        }
      });
    } else {
      historyContainer.innerHTML = `
        <div class="no-history">
          <p>No weather searches yet. Start by searching for a city!</p>
        </div>
      `;
    }
  } catch (error) {
    historyContainer.innerHTML = `
      <div class="no-history">
        <p>Error loading history</p>
      </div>
    `;
  }
});