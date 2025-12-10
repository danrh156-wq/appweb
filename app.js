const API_KEY = "ce4fe8a4aa9beacabe72cabae2cda3b1";

const form = document.querySelector(".search-form");
const input = document.querySelector(".search-form__input");
const cityName = document.querySelector(".current-weather__city");
const temp = document.querySelector(".current-weather__temp");
const tempMinMax = document.querySelector(".current-weather__temp-minmax");
const desc = document.querySelector(".current-weather__desc");
const icon = document.querySelector(".current-weather__icon");
const forecastContainer = document.querySelector(".forecast");

// Función para usar iconos locales
function getLocalIcon(iconCode) {
    return `assets/icons/${iconCode}.png`;
}

// Obtener clima actual
async function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener clima actual");

    return await res.json();
}

// Obtener pronóstico
async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener pronóstico");

    return await res.json();
}

// Actualizar clima actual
function updateCurrentWeather(data) {
    cityName.textContent = data.name;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    tempMinMax.textContent = `Min: ${Math.round(data.main.temp_min)}°C | Max: ${Math.round(data.main.temp_max)}°C`;
    desc.textContent = data.weather[0].description;
    icon.src = getLocalIcon(data.weather[0].icon);
    icon.alt = data.weather[0].description;
}

// Actualizar pronóstico
function updateForecast(data) {
    forecastContainer.innerHTML = "";

    const forecastList = data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 5);

    forecastList.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <h3>${new Date(item.dt_txt).toLocaleDateString("es-ES", { weekday: "short" })}</h3>
            <img src="${getLocalIcon(item.weather[0].icon)}" alt="${item.weather[0].description}">
            <p>${Math.round(item.main.temp)}°C</p>
            <p>${item.weather[0].description}</p>
        `;
        forecastContainer.appendChild(card);
    });
}

// Manejo del formulario
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return;

    try {
        const current = await getCurrentWeather(city);
        const forecast = await getForecast(city);

        updateCurrentWeather(current);
        updateForecast(forecast);

        input.value = "";
    } catch (error) {
        alert("Ciudad no encontrada o error en la API.");
        console.error(error);
    }



});
