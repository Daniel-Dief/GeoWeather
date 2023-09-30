const form = document.querySelector('.catch-citie form');
const input = document.querySelector('#citie_input');

var json_temp;

const citie_info = {
    name: "",
    lat: "",
    lon: "",
    weather: "",
    description: "",
    icon: "",
    temp: "",
    temp_min: "",
    temp_max: "",
    pressure: "",
    humidity: "",
    wind: "",
    clouds: "",
    country: ""
};
const country_info = {
    name: "",
    cca2: "",
    official_name: "",
    capital: "",
    region: "",
    lat: "",
    lon: "",
    area: "",
    population: "",
    flag_link: "",
    languages: "",
    currency: "",
    borders: ""
}

async function request_citie(citie_name) {
    json = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citie_name}&appid=281ae3f9df1c5146067af84cfbd932a5`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                citie_info.name = null;
                citie_info.lat = null;
                citie_info.lon = null;
                citie_info.weather = null;
                citie_info.description = null;
                citie_info.icon = null;
                citie_info.country = null;
                citie_info.temp = null;
                citie_info.temp_min = null;
                citie_info.temp_max = null;
                citie_info.pressure = null;
                citie_info.humidity = null;
                citie_info.wind = null;
                citie_info.clouds = null;

                alert("Cidade não encontrada");
                return null;
            }
        });
    if (json != null) {
        citie_info.name = json.name;
        citie_info.lat = json.coord.lat;
        citie_info.lon = json.coord.lon;
        citie_info.weather = json.weather[0].main;
        citie_info.description = json.weather[0].description;
        citie_info.icon = json.weather[0].icon;
        citie_info.temp = json.main.temp;
        citie_info.temp_min = json.main.temp_min;
        citie_info.temp_max = json.main.temp_max;
        citie_info.pressure = json.main.pressure;
        citie_info.humidity = json.main.humidity;
        citie_info.wind = json.wind.speed;
        citie_info.clouds = json.clouds.all;
        citie_info.country = json.sys.country;
    }
}

async function request_country(country_code) {
    json = await fetch(`https://restcountries.com/v3.1/alpha/${country_code}`)
        .then(response => response.json());
    if (json.status != 404) {
        country_info.name = json[0].altSpellings[1];
        country_info.cca2 = json[0].altSpellings[0];
        country_info.official_name = json[0].altSpellings[2];
        country_info.capital = json[0].capital[0];
        country_info.region = json[0].region;
        country_info.lat = json[0].latlng[0];
        country_info.lon = json[0].latlng[1];
        country_info.area = json[0].area;
        country_info.population = json[0].population;
        country_info.flag_link = json[0].flags.png;
        country_info.languages = json[0].languages;
        country_info.currency = json[0].currencies;
        country_info.borders = json[0].borders;
    } else {
        country_info.status = 404;
        country_info.message = "Country not found";
    }
}

async function request_data_base(input) {
    let env_form = new FormData();
    env_form.append('citie', input);

    const data = await fetch('./php/request.php', {
        method: 'POST',
        body: env_form
    }).then(response => {
        json_temp = response.json();
    });
}

async function request(citie_name) {
    await request_citie(citie_name);
    if(json != null){
        await request_country(citie_info.country);
    } else {
        await request_data_base(input.value);
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    request(input.value);
});