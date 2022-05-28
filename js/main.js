let place = document.getElementById("place");
let searcher = document.getElementById("searcher");
let selectCity = document.getElementById("citySelect");
let selectOption;
let searchVal = '';
let apiKey = '8e1cf7d0e536d5b4b9e3ab3ff361aaf5';
let lat = 44.81;
let lon = 20.46;
let city;
let cities;
//let apiPath = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

async function LoadWeather() {
    let weatherData = await fetch(apiPath);
    let dat = await weatherData.json();

    console.log("Load Weather -> dat:");
    console.log(dat);
}

async function LoadCities() {
    let jsonconn = await fetch('js/worldcities.json');

    cities = await jsonconn.json();
    console.log("LOAD CITIES -> cities:");
    console.log(cities);

    // city = await cities.filter(e => e.city == 'Belgrade')

    // console.log("Load Cities -> City:");
    // console.log(city);
    // console.log("Load Cities -> Coordinates:");
    // console.log(`Latitude: ${city[0].lat} / Longitude: ${city[0].lng}`);

}
LoadCities();
LoadWeather();

place.addEventListener('click', function(e) {
    e.preventDefault();

    searcher.classList.replace('d-none', 'd-block');
    searcher.focus();
});

searcher.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        //change city and state
        console.log('enter');
        console.log(searcher.value);
        searchVal = searcher.value;
        searcher.classList.replace('d-block', 'd-none');

        //let flt = cities.properties.name.filter(e => e == searchVal);
    }
    // else {
    //     console.log(searcher.value);
    //     city = cities.filter(ea => ea.city = searcher.value)
    //     if (city > 0) {
    //         selectCity.classList.replace('d-none', 'd-block');


    //         city.forEach(eb => {
    //             selectCity.innerHTML = selectCity.innerHTML + `<option>${eb.city}, ${eb.country}</option>`;
    //         });
    //     }
    // }
});

searcher.addEventListener('keyup', async function() {
    // console.log(searcher.value);
    //city = await cities.filter(ea => ea.city == searcher.value)
    city = await cities.filter(ea => {
        return ea.city.includes(searcher.value);
    })
    console.log(`Searcher -> KeyUP -> City:`);
    console.log(city);
    selectCity.innerHTML = '';
    if (city.length > 0 && city.length < 10) {
        selectCity.classList.replace('d-none', 'd-block');

        city.forEach(eb => {
            selectCity.innerHTML = selectCity.innerHTML + `<option value="${eb.lat},${eb.lng}">${eb.city}, ${eb.country}</option>`;
        });
        selectOption = document.getElementsByTagName('option');
    } else {
        selectCity.classList.replace('d-block', 'd-none');
        selectOption = undefined;
    }
});

selectCity.addEventListener('click', () => {
    //ovde sam stao
});