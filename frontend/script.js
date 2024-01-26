// Global variables
let currentCity = null;
var hotelData = null;

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
    const apiUrl = `http://127.0.0.1:8000/weather_view/${city}/`;

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


// handling city dropdown options
function loadCities() {
    // Get the selected prefecture value
    const prefectureSelect = document.getElementById("prefecture");
    const selectedPrefecture = prefectureSelect.value;

    // Get the corresponding cities for the selected prefecture
    const cities = japanCities[selectedPrefecture];

    // Clear existing city options
    const citySelect = document.getElementById("city");
    citySelect.innerHTML = "";

    // Add new city options
    cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.text = city;
        citySelect.add(option);
    });
}

const japanCities = {
    'hokkaido': ['札幌', '函館', '旭川'],
    'aomori': ['青森', '八戸', '弘前'],
    'iwate': ['盛岡', '岩手', '花巻'],
    'miyagi': ['仙台', '松島', '石巻'],
    'akita': ['秋田', '横手', '大館'],
    'yamagata': ['山形', '天童', '酒田'],
    'fukushima': ['福島', '郡山', 'いわき'],
    'ibaraki': ['水戸', 'つくば', '日立'],
    'tochigi': ['宇都宮', '足利', '鹿沼'],
    'gunma': ['前橋', '高崎', '桐生'],
    'saitama': ['さいたま', '川口', '越谷'],
    'chiba': ['千葉', '船橋', '市川'],
    'tokyo': ['東京', '新宿', '渋谷'],
    'kanagawa': ['横浜', '川崎', '相模原'],
    'niigata': ['新潟', '長岡', '上越'],
    'toyama': ['富山', '金沢', '高岡'],
    'ishikawa': ['金沢', '小松', '加賀'],
    'fukui': ['福井', '小浜', '坂井'],
    'yamanashi': ['甲府', '笛吹', '石和'],
    'nagano': ['長野', '松本', '上田'],
    'gifu': ['岐阜', '高山', '羽島'],
    'shizuoka': ['静岡', '浜松', '三島'],
    'aichi': ['名古屋', '豊田', '岡崎'],
    'mie': ['津', '四日市', '伊勢'],
    'shiga': ['大津', '彦根', '長浜'],
    'kyoto': ['京都', '宇治', '亀岡'],
    'osaka': ['大阪', '堺', '東大阪'],
    'hyogo': ['神戸', '姫路', '尼崎'],
    'nara': ['奈良', '橿原', '大和高田'],
    'wakayama': ['和歌山', '橋本', '和歌山'],
    'tottori': ['鳥取', '米子', '倉吉'],
    'shimane': ['松江', '出雲', '浜田'],
    'okayama': ['岡山', '倉敷', '津山'],
    'hiroshima': ['広島', '福山', '呉'],
    'yamaguchi': ['山口', '下関', '宇部'],
    'tokushima': ['徳島', '鳴門', '阿南'],
    'kagawa': ['高松', '丸亀', '坂出'],
    'ehime': ['松山', '宇和島', '新居浜'],
    'kochi': ['高知', '南国', '宿毛'],
    'fukuoka': ['福岡', '北九州', '久留米'],
    'saga': ['佐賀', '唐津', '伊万里'],
    'nagasaki': ['長崎', '佐世保', '島原'],
    'kumamoto': ['熊本', '八代', '玉名'],
    'oita': ['大分', '別府', '宇佐'],
    'miyazaki': ['宮崎', '都城', '延岡'],
    'kagoshima': ['鹿児島', '霧島', '薩摩川内'],
    'okinawa': ['那覇', '浦添', '沖縄']
};

const cityRomaji = {
    '札幌': 'sapporo',
    '函館': 'hakodate',
    '旭川': 'asahikawa',
    '青森': 'aomori',
    '八戸': 'hachinohe',
    '弘前': 'hirosaki',
    '盛岡': 'morioka',
    '岩手': 'iwate',
    '花巻': 'hanamaki',
    '仙台': 'sendai',
    '松島': 'matsushima',
    '石巻': 'ishinomaki',
    '秋田': 'akita',
    '横手': 'yokote',
    '大館': 'odate',
    '山形': 'yamagata',
    '天童': 'tendo',
    '酒田': 'sakata',
    '福島': 'fukushima',
    '郡山': 'koriyama',
    'いわき': 'iwaki',
    '水戸': 'mito',
    'つくば': 'tsukuba',
    '日立': 'hitachi',
    '宇都宮': 'utsunomiya',
    '足利': 'ashikaga',
    '鹿沼': 'kanuma',
    '前橋': 'maebashi',
    '高崎': 'takasaki',
    '桐生': 'kiryu',
    'さいたま': 'saitama',
    '川口': 'kawaguchi',
    '越谷': 'koshigaya',
    '千葉': 'chiba',
    '船橋': 'funabashi',
    '市川': 'ichikawa',
    '東京': 'tokyo',
    '新宿': 'shinjuku',
    '渋谷': 'shibuya',
    '横浜': 'yokohama',
    '川崎': 'kawasaki',
    '相模原': 'sagamihara',
    '新潟': 'niigata',
    '長岡': 'nagaoka',
    '上越': 'joetsu',
    '富山': 'toyama',
    '金沢': 'kanazawa',
    '高岡': 'takaoka',
    '金沢': 'kanazawa',
    '小松': 'komatsu',
    '加賀': 'kaga',
    '福井': 'fukui',
    '小浜': 'obama',
    '坂井': 'sakai',
    '甲府': 'kofu',
    '笛吹': 'fuefuki',
    '石和': 'isawa',
    '長野': 'nagano',
    '松本': 'matsumoto',
    '上田': 'ueda',
    '岐阜': 'gifu',
    '高山': 'takayama',
    '羽島': 'hashima',
    '静岡': 'shizuoka',
    '浜松': 'hamamatsu',
    '三島': 'mishima',
    '名古屋': 'nagoya',
    '豊田': 'toyota',
    '岡崎': 'okazaki',
    '津': 'tsu',
    '四日市': 'yokkaichi',
    '伊勢': 'ise',
    '大津': 'otsu',
    '彦根': 'hikone',
    '長浜': 'nagahama',
    '京都': 'kyoto',
    '宇治': 'uji',
    '亀岡': 'kameoka',
    '大阪': 'osaka',
    '堺': 'sakai',
    '東大阪': 'higashiosaka',
    '神戸': 'kobe',
    '姫路': 'himeji',
    '尼崎': 'amagasaki',
    '奈良': 'nara',
    '橿原': 'kashihara',
    '大和高田': 'yamatokoriyama',
    '和歌山': 'wakayama',
    '橋本': 'hashimoto',
    '和歌山': 'wakayama',
    '鳥取': 'tottori',
    '米子': 'yonago',
    '倉吉': 'kurayoshi',
    '松江': 'matsue',
    '出雲': 'izumo',
    '浜田': 'hamada',
    '岡山': 'okayama',
    '倉敷': 'kurashiki',
    '津山': 'tsuyama',
    '広島': 'hiroshima',
    '福山': 'fukuyama',
    '呉': 'kure',
    '山口': 'yamaguchi',
    '下関': 'shimonoseki',
    '宇部': 'ube',
    '徳島': 'tokushima',
    '鳴門': 'naruto',
    '阿南': 'anan',
    '高松': 'takamatsu',
    '丸亀': 'marugame',
    '坂出': 'sakaide',
    '松山': 'matsuyama',
    '宇和島': 'uwajima',
    '新居浜': 'niihama',
    '高知': 'kochi',
    '南国': 'nankoku',
    '宿毛': 'susaki',
    '福岡': 'fukuoka',
    '北九州': 'kitakyushu',
    '久留米': 'kurume',
    '佐賀': 'saga',
    '唐津': 'karatsu',
    '伊万里': 'imari',
    '長崎': 'nagasaki',
    '佐世保': 'sasebo',
    '島原': 'shimabara',
    '熊本': 'kumamoto',
    '八代': 'yatsushiro',
    '玉名': 'tamana',
    '大分': 'oita',
    '別府': 'beppu',
    '宇佐': 'usa',
    '宮崎': 'miyazaki',
    '都城': 'miyakonojo',
    '延岡': 'nobeoka',
    '鹿児島': 'kagoshima',
    '霧島': 'kirishima',
    '薩摩川内': 'satsumasendai',
    '那覇': 'naha',
    '浦添': 'urasoe',
    '沖縄': 'okinawa'
};


function searchHotels() {
    // Get selected prefecture and city values
    const prefectureSelect = document.getElementById("prefecture");
    const selectedPrefecture = prefectureSelect.value;

    const citySelect = document.getElementById("city");
    const selectedCityKanji = citySelect.value;

    // Look up the romanized city name from cityRomaji dictionary
    const selectedCityRomaji = cityRomaji[selectedCityKanji];

    // Prepare data to send to Django backend
    const data = {
        middleClassCode: selectedPrefecture,
        smallClassCode: selectedCityRomaji
    };

    // Make a request to Django backend 
    fetch(`http://127.0.0.1:8000/search_hotels_view/${selectedPrefecture}/${selectedCityRomaji}/`)
        .then(response => response.json())
        .then(jsonData => {

            hotelData = jsonData;
            console.log(hotelData);
            moveToNextHotel();
            

        })
        .catch(error => console.error("Error fetching data:", error));
}


// Function to populate the HTML div with hotel information
function populateHotelInfo(hotelDataIndex) {
    // Check if hotelData is defined and contains data
    if (hotelData && hotelData.hotels && hotelData.hotels.length > 0) {
        // Populate the HTML elements with hotel information
        document.getElementById('hotelName').textContent = hotelData.hotels[hotelDataIndex].hotelName;
        document.getElementById('hotelImageUrl').src = hotelData.hotels[hotelDataIndex].hotelImageUrl;
        document.getElementById('hotelInformationUrl').innerHTML = `<a href="${hotelData.hotels[hotelDataIndex].hotelInformationUrl}" target="_blank" style="color: white;">楽天トラベルで見る</a>`;
        document.getElementById('userReview').textContent = `ユーザーレビュー：${hotelData.hotels[hotelDataIndex].userReview}`;
        document.getElementById('serviceAverage').textContent = `サービス平均：${hotelData.hotels[hotelDataIndex].serviceAverage}`;
        document.getElementById('locationAverage').textContent = `立地平均：${hotelData.hotels[hotelDataIndex].locationAverage}`;
        document.getElementById('roomAverage').textContent = `部屋平均：${hotelData.hotels[hotelDataIndex].roomAverage}`;
        document.getElementById('equipmentAverage').textContent = `設備平均：${hotelData.hotels[hotelDataIndex].equipmentAverage}`;
        document.getElementById('bathAverage').textContent = `バスルーム平均：${hotelData.hotels[hotelDataIndex].bathAverage}`;
        document.getElementById('mealAverage').textContent = `食事平均：${hotelData.hotels[hotelDataIndex].mealAverage}`;
        document.getElementById('nearestStation').textContent = `最寄り駅：${hotelData.hotels[hotelDataIndex].nearestStation}`;
    } else {
        console.error('hotelData is not defined or empty.');
    }
}


// Function to automatically move to the next hotel after a delay
function moveToNextHotel() {
    // Initialize index to 0
    let hotelDataIndex = 0;

    // Populate the HTML with the first hotel
    populateHotelInfo(hotelDataIndex);

    // Set a timer to move to the next hotel every 10 seconds
    setInterval(() => {
        // Increment the index
        hotelDataIndex++;

        // If index exceeds the length of hotelData, reset to 0
        if (hotelDataIndex >= hotelData.length) {
            hotelDataIndex = 0;
        }

        // Populate the HTML with the next hotel
        populateHotelInfo(hotelDataIndex);
    }, 10000); // 10 seconds
}




//function for chat box
function sendMessage() {
    var userInput = document.getElementById("userInput").value;

    // Check if the user input is not empty
    if (userInput.trim() !== "") {
        // Use AJAX to send the user message to the server
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://127.0.0.1:8000/chat_view/" + encodeURIComponent(userInput) + "/", true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Update the chat container with the response from the server
                var chatContainer = document.getElementById("chatContainer");

                var userMessage = document.createElement("div");
                userMessage.className = "user-message";
                userMessage.textContent = userInput;

                var assistantMessage = document.createElement("div");
                assistantMessage.className = "assistant-message";
                assistantMessage.textContent = xhr.responseText;

                chatContainer.appendChild(userMessage);
                chatContainer.appendChild(assistantMessage);

                // Clear the input field
                document.getElementById("userInput").value = "";
            }
        };

        xhr.send();
    }
}

