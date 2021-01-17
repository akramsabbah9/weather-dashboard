/* GLOBALS */
// information for a city will be stored in a cityInfo object,
// which looks like: { name, date, weatherIcon, desc, temp, humidity, windSpeed, uvIndex }

// array to hold past city names
var history = [];

// grab the various necessary elements
var cityDisplayEl = document.querySelector("#city-display");
var cityForecastEl = document.querySelector("#five-day-forecast");



/* FUNCTIONS */
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
}


/* MAIN */

/* Akram Sabbah */