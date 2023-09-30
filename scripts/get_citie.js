const form = document.querySelector('.catch-citie form');
const input = document.querySelector('#citie_input');

async function request(citie_name) {
    const json = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citie_name}&appid=281ae3f9df1c5146067af84cfbd932a5`)
    .then(response => response.json())

    return json;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    citie_info = request(input.value);
});
