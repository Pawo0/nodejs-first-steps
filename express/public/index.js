// https://home.openweathermap.org/api_keys
const apiKey = `b57ebfca4ac2960ed4be43e208354575`;
const weatherForm = document.getElementById("weatherForm");
const weatherInfo = document.getElementById("weatherInfo");
const cityInput = document.getElementById("cityInput");
const suggestionsList = document.getElementById("suggestions");

weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value;
    fetchWeather(city);
})

async function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`City ${city} not found!`);
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherInfo.innerHTML = error;
    }
}

function displayWeather(data) {
    console.log(data)
    weatherInfo.style.display = "block";
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const cityName = data.name;
    const icon = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;
    weatherInfo.innerHTML = `
        <h2>City name: ${cityName}</h2>
        <img src="${iconUrl}" alt="${cityName}">
        <p>Temperature: ${temperature}°C</p>
        <p>Description: ${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind speed: ${windSpeed} m/s</p>
    `;
}

// after each entered letter find new suggestions
cityInput.addEventListener("input", () => {
    const input = cityInput.value.toLowerCase();
    findSuggestions(input);
})

// from 'countriesnow.space' download every POLISH city and display all with matching letters
async function findSuggestions(input) {
    if (input.length > 0) {
        const response = await fetch(`https://countriesnow.space/api/v0.1/countries`);
        const allCities = response.json();
        allCities.then(item => {
            const polandCities = item.data.filter((item2) => item2.country === "Poland")[0].cities;
            console.log(polandCities)
            const suggestions = polandCities.filter((city) => city.toLowerCase().startsWith(input));
            displaySuggestions(suggestions);
        })
    } else {
        suggestionsList.style.display = "none";
    }

}

// clear all prev suggestions and add new
// every city after clicked shows weather for this city
function displaySuggestions(data) {
    let curr_position = cityInput.getBoundingClientRect();
    suggestionsList.style.left = curr_position.left + "px";
    suggestionsList.style.display = "block";
    suggestionsList.innerHTML = '';

    data.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        li.addEventListener("click", () => {
            cityInput.value = '';
            suggestionsList.innerHTML = '';
            fetchWeather(item);
        })
        suggestionsList.appendChild(li);
    })
}

// when text field is not on focus, hide suggestions
let isMouseOverSuggestions = false;
let hidden = false;
cityInput.addEventListener("blur", () => {
    hidden = true;
    setTimeout(() => {
        if (!isMouseOverSuggestions) suggestionsList.style.display = "none";
    }, 200);
})

cityInput.addEventListener("focus", () => {
    suggestionsList.style.display = "block";
    hidden = false;
})

suggestionsList.addEventListener("mouseenter", () => {
    isMouseOverSuggestions = true;
})
suggestionsList.addEventListener("mouseleave", () => {
    isMouseOverSuggestions = false;
    if (hidden) suggestionsList.style.display = "none";
})