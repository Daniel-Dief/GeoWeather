const form = document.querySelector('.catch-citie form');
const input = document.querySelector('#citie_input');
var mensage = "";
const citie_info = {
    name: "",
    lat: "",
    lon: "",
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
    currency_symbol: "",
    borders: ""
}

async function request_citie(citie_name) {
    json = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citie_name}&appid=281ae3f9df1c5146067af84cfbd932a5&lang=pt_br`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                citie_info.name = null;
                citie_info.lat = null;
                citie_info.lon = null;
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

                mensage = "Cidade não encontrada, procurando por país";
                return null;
            }
        });
    if (json != null) {
        citie_info.name = json.name;
        citie_info.lat = json.coord.lat;
        citie_info.lon = json.coord.lon;
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

        mensage = "Coletando dados";
    }
}

async function request_country(country_search, code) {
    if(code){
        json = await fetch(`https://restcountries.com/v3.1/alpha/${country_search}`)
        .then(response => response.json());
    } else {
        json = await fetch(`https://restcountries.com/v3.1/name/${country_search}`)
        .then(response => response.json());
    }
    if (json.status != 404) {
        country_info.name = json[0].name.common;
        country_info.cca2 = json[0].altSpellings[0];
        country_info.official_name = json[0].name.official;
        country_info.capital = json[0].capital[0];
        country_info.region = json[0].region;
        country_info.lat = json[0].latlng[0];
        country_info.lon = json[0].latlng[1];
        country_info.area = json[0].area;
        country_info.population = json[0].population;
        country_info.flag_link = json[0].flags.png;
        country_info.languages = json[0].languages;
        if(json[0].borders){
            country_info.borders = json[0].borders;
        } else {
            country_info.borders = ['Não há.']
        }

        /*get currency*/
        Object.keys(json[0].currencies).forEach(key => {
            country_info.currency = json[0].currencies[key].name;
            country_info.currency_symbol = json[0].currencies[key].symbol;
        });

        /*get languages*/
        Object.keys(json[0].languages).forEach(key => {
            country_info.languages = json[0].languages[key];
        })

    } else {
        country_info.status = 404;
        country_info.message = "Country not found";
    }

    cont = 0;
    old_borders = [];

    country_info.borders.forEach(border => {
        if(cont % 6 == 0 && cont != 0){
            old_borders.push('<br>');
        }
        old_borders.push(border)
        cont++;
    });
    country_info.borders = old_borders.join(', ').replaceAll('<br>,', '<br>');
}

async function request_data_base(input) {
    let env_form = new FormData();
    env_form.append('citie', input);

    const data = await fetch('./php/request.php', {
        method: 'POST',
        body: env_form
    }).then(response => response.json())
    .catch(error => {
        setTimeout(() => {
            alert(`Cidade "${input}" não encontrada, tente novamente!`)
            document.querySelector('.catch-citie').style.display = "block";
            document.querySelector('#citie_input').value = "";
            document.querySelector('.loading').style.display = "none";
        }, 1500);
    });

    country_info.name = data[0].country;
}

async function request(citie_name) {
    if(citie_name.toLowerCase().trim() == "garopaba"){
        citie_name = "Imbituba";
        ifgaropaba = true;
    } else {
        ifgaropaba = false;
    }
    await request_citie(citie_name);
    document.querySelector('.catch-citie').style.display = "none";
    document.querySelector('.loading').style.display = "flex";
    document.querySelector('.loading .mensage').innerHTML = mensage;
    for (let i=1;i<=3; i++) {
        setTimeout(() => {
            document.querySelector('.loading .mensage').innerHTML += ".";
        }, 500*i);
    }
    if(json != null){
        await request_country(citie_info.country, true);
    } else {
        await request_data_base(input.value);
        await request_country(country_info.name, false);
        await request_citie(country_info.capital);
    }
    if(ifgaropaba){
        citie_info.name = "Garopaba";
        citie_info.lat = -28.0278;
        citie_info.lon = -48.6192;
    }
    setTimeout(() => {
        document.querySelector('.loading').style.display = "none";
        create_map();
        transition();
    }, 2000);
}

function transition(){
    document.querySelector('.catch-citie').style.display = "none";
    document.querySelector('.information').style.display = "flex";
    document.querySelector('#logo').style.display = "none";
    
    

    /*citie_info*/
    document.querySelector('.citie_info .nome').innerHTML = citie_info.name;
    document.querySelector('.citie_info .icon').src = "https://openweathermap.org/img/wn/" + citie_info.icon + "@2x.png";
    document.querySelector('.citie_info .clima').innerHTML = "Clima: " + citie_info.description;
    document.querySelector('.citie_info .nuvens').innerHTML = "Nuvens: " + citie_info.clouds + "%";
    document.querySelector('.citie_info .latitude').innerHTML = "Latitude: " + citie_info.lat;
    document.querySelector('.citie_info .longitude').innerHTML = "Longitude: " + citie_info.lon;
    document.querySelector('.citie_info .temp').innerHTML = "Temperatura: " + parseFloat((citie_info.temp - 273.15).toFixed(2)) + "°C";
    document.querySelector('.citie_info .temp_max').innerHTML = "Temperatura Máxima: " + parseFloat((citie_info.temp_max - 273.15).toFixed(2)) + "°C";
    document.querySelector('.citie_info .temp_min').innerHTML = "Temperatura Mínima: " + parseFloat((citie_info.temp_min - 273.15).toFixed(2)) + "°C";
    document.querySelector('.citie_info .precao').innerHTML = "Pressão: " + citie_info.pressure + " hpa";
    document.querySelector('.citie_info .humidade').innerHTML = "Umidade: " + citie_info.humidity + "%";
    document.querySelector('.citie_info .vento').innerHTML = "Vento: " + citie_info.wind + "m/s";

    /*country_info*/

    document.querySelector('.country_info .nome') .innerHTML = country_info.name;
    document.querySelector('.country_info .sigla').innerHTML = "Sigla: " + country_info.cca2; 
    document.querySelector('.country_info .nome_official').innerHTML = "Nome oficial: " + country_info.official_name; 
    document.querySelector('.country_info .moeda').innerHTML = "Moeda: " + country_info.currency;
    document.querySelector('.country_info .simbolo_moeda').innerHTML = "Simbolo da moeda: "  + country_info.currency_symbol;
    document.querySelector('.country_info .capital').innerHTML = "Capital: " + country_info.capital;
    document.querySelector('.country_info .regiao').innerHTML = "Região: " + country_info.region;
    document.querySelector('.country_info .lingua').innerHTML = "Língua: " + country_info.languages;
    document.querySelector('.country_info .latitude').innerHTML = "Latitude: " + country_info.lat;
    document.querySelector('.country_info .longitude').innerHTML = "Longitude: " + country_info.lon;
    document.querySelector('.country_info .fronteiras').innerHTML = "Fronteiras: " + country_info.borders;
    document.querySelector('.country_info .area').innerHTML = "Área territorial: " + country_info.area + " Km²";
    document.querySelector('.country_info .populacao').innerHTML = "População: " + country_info.population + " de pessoas";
    document.querySelector('.country_info .bandeira').src = country_info.flag_link;
}

function create_map(){
    document.querySelector('.citie_map').innerHTML = `<iframe class="iframe_map" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d94191.64732381087!2d${citie_info.lon}!3d${citie_info.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1696557851166!5m2!1spt-BR!2sbr"  width="100%" height="100%" frameborder="0" style="border:0" allowfullscreen></iframe>`;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    request(input.value.trim());
});