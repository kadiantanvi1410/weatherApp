
const API_KEY = "4abf294b67fa422fc93963b4d9a4587e";

let cityInput = document.querySelector("#cityInput");
let form = document.querySelector("form");
let weather = document.querySelector("#fetchData");
let searchedCities = document.querySelector(".searchedCities");
let consoleOutput = document.querySelector("#consoleOutput");

function log(message, type) {
    console.log(message);

    let entry = document.createElement("div");
    entry.classList.add("log", type || "sync");

    let dot = document.createElement("div");
    dot.classList.add("log-dot");

    let text = document.createElement("span");
    text.textContent = message;

    entry.appendChild(dot);
    entry.appendChild(text);
    consoleOutput.appendChild(entry);
}

function getHistory() {
    return JSON.parse(localStorage.getItem("cities")) || [];
}
function changeBackground(weatherType) {

    let body = document.body;

    switch(weatherType.toLowerCase()) {

        case "clear":
            body.style.background = `
                linear-gradient(135deg, rgba(252,234,187,0.7), rgba(248,181,0,0.7)),
                url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScyvUtonRKyPspPZFmndR0lmlQez8V2ZSnMQ&s")
            `;
            break;

        case "clouds":
            body.style.background = `
                linear-gradient(135deg, rgba(215,210,204,0.7), rgba(48,67,82,0.7)),
                url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReEY0bcx-dScMdtxvGdQm4FKETERzXQspXww&s")
            `;
            break;

        case "rain":
        case "drizzle":
            body.style.background = `
                linear-gradient(135deg, rgba(78,84,200,0.7), rgba(143,148,251,0.7)),
                url("data:image/jpeg;base64,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")
            `;
            break;

        case "thunderstorm":
            body.style.background = `
                linear-gradient(135deg, rgba(35,37,38,0.8), rgba(65,67,69,0.8)),
                url("images/storm.jpg")
            `;
            break;

        case "snow":
            body.style.background = `
                linear-gradient(135deg, rgba(230,218,218,0.7), rgba(39,64,70,0.7)),
                url("images/snow.jpg")
            `;
            break;

        case "mist":
        case "haze":
        case "fog":
            body.style.background = `
                linear-gradient(135deg, rgba(117,127,154,0.7), rgba(215,221,232,0.7)),
                url("data:image/jpeg;base64,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")
            `;
            break;

        default:
            body.style.background = `
                linear-gradient(135deg, rgba(137,247,254,0.7), rgba(102,166,255,0.7)),
                url("images/default.jpg")
            `;
    }

    // 🔥 IMPORTANT (for proper display)
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
    body.style.backgroundRepeat = "no-repeat";
}
function saveToHistory(cityName) {
    let history = getHistory();
    history = history.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    history.unshift(cityName);
    if (history.length > 5) history = history.slice(0, 5);
    localStorage.setItem("cities", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    let history = getHistory();
    searchedCities.innerHTML = "";

    if (history.length === 0) {
        searchedCities.innerHTML = "<p>No recent searches.</p>";
        return;
    }

    history.forEach(function(city) {
        let chip = document.createElement("span");
        chip.textContent = city;
        chip.classList.add("chip");
        chip.addEventListener("click", function() {
            cityInput.value = city;
            getWeatherInfo(city);
        });
        searchedCities.appendChild(chip);
    });
}


async function getWeatherInfo(city) {

    if (!city || city.trim() === "") {
        weather.innerHTML = "<p class='error'>Please enter a city name.</p>";
        return;
    }

    weather.innerHTML = "<p>Loading...</p>";

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        // 🎨 CALL BACKGROUND FUNCTION
        changeBackground(data.weather[0].main);

        weather.innerHTML = `
            <div class="weather-row"><span>City</span><span>${data.name}, ${data.sys.country}</span></div>
            <div class="weather-row"><span>Temp</span><span>${data.main.temp} °C</span></div>
            <div class="weather-row"><span>Weather</span><span>${data.weather[0].main}</span></div>
            <div class="weather-row"><span>Humidity</span><span>${data.main.humidity}%</span></div>
            <div class="weather-row"><span>Wind</span><span>${data.wind.speed} m/s</span></div>
        `;

        saveToHistory(data.name);

    } catch (error) {
        weather.innerHTML = `<p class='error'>${error.message}</p>`;
    }
}

form.addEventListener("submit", function(e) {
    e.preventDefault();
    getWeatherInfo(cityInput.value);
});

renderHistory();