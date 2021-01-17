/* GLOBALS */
// information for a city will be stored in a cityInfo object,
// which looks like: { name, date, weatherIcon, desc, temp, humidity, windSpeed, uvIndex }

// array to hold past city names
var searchHistory = [];

// grab the various necessary elements
var cityDisplayEl = document.querySelector("#city-display");
var cityForecastEl = document.querySelector("#five-day-forecast");
var historyEl = document.querySelector("#history");




/* FUNCTIONS */
// query OpenWeather API for the given city name and handle it
var getCity = function (name) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + name +
      "&appid=118ffe51d5d5c6c938996e3658689365";
    
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                handleCityData(data);
            });
        }
        else {
            alert("Error: " + response.statusText);
        }
    });
};


// construct a cityInfo object from data and displays it
var handleCityData = function (data) {
    // add the name of this city to the searchHistory array and push to localStorage
    updateHistory(data.name);

    // format date from UTC unix timestamp to a MM/DD/YYYY string
    var date = moment.unix(data.dt).format("MM/DD/YYYY");

    // format temperature from Kelvin to Fahrenheit
    var temp = (data.main.temp - 273.15) * 9/5 + 32;

    // build all of cityInfo except the uvIndex
    var cityInfo = {
        name: data.name,
        date: date,
        weatherIcon: data.weather[0].icon,
        desc: data.weather[0].desc,
        temp: temp.toFixed(2),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
    };
    
    // fetch uv data based on latitude and longitude
    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat +
      "&lon=" + data.coord.lon + "&appid=118ffe51d5d5c6c938996e3658689365";

    fetch(uvUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                // if success, we have everything we need to build cityInfo.
                cityInfo.uvIndex = data.value;
                displayCity(cityInfo);
                updateStorage(cityInfo); // push to localStorage
            });
        }
        else {
            alert("Error: " + response.statusText);
        }
    });
};


// display the given cityInfo
var displayCity = function (cityInfo) {
    // clear old cityDisplayEl
    cityDisplayEl.innerHTML = "";

    // make the card element to hold this info
    var cardEl = document.createElement("div");
    cardEl.className = "card mt-4 mb-3 pb-3";

    var bodyEl = document.createElement("div");
    bodyEl.className = "card-body";
    cardEl.appendChild(bodyEl);

    // add the city name, date, weather
    var name = document.createElement("h2");
    name.className = "card-title pt-2 pb-2";
    name.innerHTML = cityInfo.name + " <span>(" + cityInfo.date +
      ")</span><img src='https://openweathermap.org/img/w/" + cityInfo.weatherIcon +
      ".png' alt='" + cityInfo.desc + "' />";
    
    bodyEl.appendChild(name);

    // add temp, humidity, windSpeed, uvIndex
    var properties = [];
    for (let i = 0; i < 4; i++) {
        properties[i] = document.createElement("p");
        properties[i].className = "card-text text-muted";
        bodyEl.appendChild(properties[i]);
    }
    properties[0].textContent = "Temperature: " + cityInfo.temp + " ˚F";
    properties[1].textContent = "Humidity: " + cityInfo.humidity + "%";
    properties[2].textContent = "Wind Speed: " + cityInfo.windSpeed + " MPH";

    // color button for uvIndex and append it
    var color;
    if (cityInfo.uvIndex >= 6) color = "bg-danger";
    else if (cityInfo.uvIndex >= 3) color = "bg-warning";
    else color = "bg-success";

    properties[3].innerHTML = "UV Index: <span class='btn text-white " + color + "'>" +
      cityInfo.uvIndex + "</span>";

    // append the finished card to cityDisplayEl
    cityDisplayEl.appendChild(cardEl);
};


// display searchHistory on the left side of the page
var displayHistory = function () {
    // clear the ul
    historyEl.innerHTML = "";

    // make an li element for each name in searchHistory
    for (let i = searchHistory.length-1; i >= 0; i--) {
        var listNameEl = document.createElement("li");
        listNameEl.className = "list-group-item";
        listNameEl.textContent = searchHistory[i];

        // append this list element to the ul
        historyEl.appendChild(listNameEl);
    }
};

// get searchHistory and lastCity from localStorage and display them
var getStorage = function () {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    displayHistory();

    var lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        displayCity(JSON.parse(lastCity));
    }
};

// push most recent name to searchHistory, then push searchHistory to localStorage
var updateHistory = function (name) {
    // if searchHistory is too big, remove the first element
    if (searchHistory.length >= 10) {
        searchHistory.shift();
    }
    searchHistory.push(name);
    displayHistory();
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
};

// push the currently displayed city's cityInfo object to localStorage
var updateStorage = function (cityInfo) {
    localStorage.setItem("lastCity", JSON.stringify(cityInfo));
};



/* EVENT LISTENERS */




/* MAIN */
getStorage();

/* Akram Sabbah */