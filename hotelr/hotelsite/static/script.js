function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Fetch city and state information using an IP geolocation API
    fetch(`https://geocode.xyz/${latitude},${longitude}?json=1`)
        .then(response => response.json())
        .then(data => {
            const city = data.city;
            const state = data.state;

            console.log(`${city}, ${state}`);
            updateWeather(city, state);  // Pass city and state to updateWeather function
        })
        .catch(error => {
            console.error("Error fetching location information:", error);
        });
}


// Function to get location and initiate weather update
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Function to update weather information on the HTML page
function updateWeather(city, state) {
    // Replace the URL with the correct URL of your Django application
    const apiUrl = `/weather_view/${city}/${state}/`;
    console.log(city,state);

    // Make a fetch request to your Django view
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Update the HTML content with the weather information
            const weatherElement = document.getElementById('weather');
            weatherElement.innerHTML = `Current Weather: ${data.temp}°C, ${data.wind_spd} m/s`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

 
