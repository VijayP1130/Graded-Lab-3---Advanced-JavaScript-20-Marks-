// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.apiKey = '4d8fb5b93d4af21d66a2948710284366'; // Free OpenWeatherMap API key
        this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
        this.init();
    }

    init() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.weatherInfo = document.getElementById('weatherInfo');

        this.bindEvents();
        this.loadDefaultWeather();
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        this.cityInput.addEventListener('input', () => this.clearError());
    }

    async handleSearch() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        await this.getWeatherData(city);
    }

    async loadDefaultWeather() {
        // Load weather for a default city on page load
        await this.getWeatherData('New York');
    }

    async getWeatherData(city) {
        try {
            this.showLoading();
            
            const response = await fetch(
                `${this.apiUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error(response.status === 404 ? 'City not found' : 'Weather data unavailable');
            }
            
            const data = await response.json();
            this.displayWeatherData(data);
            
        } catch (error) {
            this.showError(error.message || 'Failed to fetch weather data');
        } finally {
            this.hideLoading();
        }
    }

    displayWeatherData(data) {
        // Extract weather data
        const {
            name: cityName,
            sys: { country },
            main: { temp, feels_like, humidity, pressure },
            weather: [{ main: weatherMain, description, icon }],
            wind: { speed: windSpeed },
            visibility = 'N/A'
        } = data;

        // Update DOM elements
        document.getElementById('cityName').textContent = cityName;
        document.getElementById('country').textContent = country;
        document.getElementById('temp').textContent = Math.round(temp);
        document.getElementById('feelsLike').textContent = `${Math.round(feels_like)}°C`;
        document.getElementById('humidity').textContent = `${humidity}%`;
        document.getElementById('windSpeed').textContent = `${windSpeed} m/s`;
        document.getElementById('pressure').textContent = `${pressure} hPa`;
        document.getElementById('weatherDescription').textContent = description;
        
        // Set weather icon
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        document.getElementById('weatherIcon').src = iconUrl;
        document.getElementById('weatherIcon').alt = description;

        // Set visibility (convert from meters to km if available)
        if (visibility !== 'N/A') {
            document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
        } else {
            document.getElementById('visibility').textContent = 'N/A';
        }

        // UV Index is not available in free plan, so we'll show N/A
        document.getElementById('uvIndex').textContent = 'N/A';

        this.showWeatherInfo();
    }

    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
        this.errorMessage.classList.add('hidden');
        this.weatherInfo.classList.add('hidden');
    }

    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.weatherInfo.classList.add('hidden');
    }

    clearError() {
        this.errorMessage.classList.add('hidden');
    }

    showWeatherInfo() {
        this.weatherInfo.classList.remove('hidden');
        this.weatherInfo.classList.add('show');
        this.errorMessage.classList.add('hidden');
    }
}

// Utility functions for additional features
const WeatherUtils = {
    // Convert temperature units
    celsiusToFahrenheit: (celsius) => (celsius * 9/5) + 32,
    fahrenheitToCelsius: (fahrenheit) => (fahrenheit - 32) * 5/9,
    
    // Get weather emoji based on condition
    getWeatherEmoji: (weatherMain) => {
        const emojiMap = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Smoke': '💨',
            'Haze': '🌫️',
            'Dust': '💨',
            'Fog': '🌫️',
            'Sand': '💨',
            'Ash': '💨',
            'Squall': '💨',
            'Tornado': '🌪️'
        };
        return emojiMap[weatherMain] || '🌤️';
    },
    
    // Format time
    formatTime: (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString();
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    const addRippleEffect = (element) => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    };

    // Apply ripple effect to search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        addRippleEffect(searchBtn);
    }
});
