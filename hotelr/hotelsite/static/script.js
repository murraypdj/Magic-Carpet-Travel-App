// Global variable to store the city
let currentCity = null;

// Function to get user's geolocation and initiate weather update
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Function to initiate weather update
function initiateWeatherUpdate() {
    // Check if currentCity is null or empty
    if (!currentCity) {
        getUserLocation();
    } else {
        // If the city is already known, send it to the backend
        passCityToBackend(currentCity);
    }
}

// Success callback for geolocation
function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Reverse geocode to get city from coordinates
    reverseGeocode(latitude, longitude);
}

// Error callback for geolocation
function errorCallback(error) {
    console.error(`Error getting geolocation: ${error.message}`);
}

// Reverse geocode to get city from coordinates
function reverseGeocode(latitude, longitude) {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    // Make AJAX request to get city name
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const city = data.address.city;
            console.log("City:", city);

            // Store the city in the global variable
            currentCity = city;

            // Pass city to Django backend
            passCityToBackend(city);
        })
        .catch(error => {
            console.error("Error fetching city:", error);
        });
}

// Pass city to Django backend
function passCityToBackend(city) {
    const apiUrl = `/weather_view/${city}/`;

    // Show loading spinner or message
    const weatherElement = document.getElementById('weather');
    weatherElement.innerHTML = 'Fetching weather data...';

    // Make AJAX request to Django backend
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Update UI with weather information
            weatherElement.innerHTML = `It's ${data.temp}°C & ${data.description},<br> In ${data.city_name}.`;

            // Schedule the next weather update after a delay (e.g., 5 minutes)
            setTimeout(initiateWeatherUpdate, 300000); // 300000 milliseconds = 5 minutes
        })
        .catch(error => {
            // Update UI with an error message
            weatherElement.innerHTML = 'Failed to retrieve weather data. Please try again later.';
            console.error("Error fetching weather data:", error);

            // Schedule the next weather update after a delay (e.g., 5 minutes)
            setTimeout(initiateWeatherUpdate, 300000); // 300000 milliseconds = 5 minutes
        });
}

// Call the function to initiate the process
initiateWeatherUpdate();
