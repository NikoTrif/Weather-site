let place = document.getElementById("place");
let searcher = document.getElementById("searcher");
let selectCity = document.getElementById("citySelect");
let usedUnit = document.querySelector('#used-unit');
let unusedUnit = document.querySelector('#unused-unit a');
let currentTemp = document.querySelector('#current-temp');
let selectOption;
let apiKey = '8e1cf7d0e536d5b4b9e3ab3ff361aaf5';
let city;
let cities;
let weatherData;

// console.log(currentTemp.textContent);

let temp;
let weather;
let feel;
let wind;
let preasure;
let visibility;
let humidity;

async function LoadWeather(lat, lon) {
    let apiPath = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    weatherData = await (await fetch(apiPath)).json();

    console.log("Load Weather -> weatherData:");
    console.log(weatherData);
}

async function LoadCities() {
    let jsonconn = await fetch('js/worldcities.json');

    cities = await jsonconn.json();
    console.log("LOAD CITIES -> cities:");
    console.log(cities);
}

function UnitConvert(tempVal, unit) {
    let tempConverted;

    switch (unit) {
        case 'C':
            tempConverted = Math.floor(tempVal - 273.15);
            break;
        case 'F':
            tempConverted = Math.floor((tempVal - 273.15) * (9 / 5) + 32);
            break;

        default:
            tempConverted = 'ERROR';
            break;
    }
    console.log('UNIT CONVERT -> tempConverted');
    console.log(`${tempConverted} ${unit}`);
    return tempConverted;
}

LoadCities();
LoadWeather(44.81, 20.46);

place.addEventListener('click', function(e) {
    e.preventDefault();

    searcher.classList.toggle('d-none');
    searcher.classList.toggle('d-block');
    searcher.focus();
});

searcher.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        console.log('enter');
        console.log(searcher.value);
        selectCity.selectedIndex = 0;
        selectCity.click();
        searcher.classList.replace('d-block', 'd-none');
        searcher.value = null;
    }
});

searcher.addEventListener('keyup', async function() {
    city = await cities.filter(ea => {
        return ea.city.toLowerCase().includes(searcher.value.toLowerCase());
    })
    console.log(`Searcher - > KeyUP - > City: `);
    console.log(city);
    selectCity.innerHTML = '';
    if (city.length > 0 && city.length < 10) {
        selectCity.classList.replace('d-none', 'd-block');
        selectCity.setAttribute('size', city.length);
        selectCity.classList.remove('fomr-select');

        city.forEach(eb => {
            selectCity.innerHTML = selectCity.innerHTML + `<option value = "${eb.lat},${eb.lng}"> ${eb.city}, ${eb.country}</option>`;
        });
        selectOption = document.getElementsByTagName('option');
    } else {
        selectCity.classList.replace('d-block', 'd-none');
        selectOption = undefined;
    }
});

selectCity.addEventListener('click', async() => {
    let coordinates = selectCity.value.split(',');
    console.log(selectCity.value);

    await LoadWeather(coordinates[0], coordinates[1]);

    selectCity.classList.replace('d-block', 'd-none');
    searcher.classList.replace('d-block', 'd-none');
    searcher.value = null;

    place.innerHTML = selectCity.options[selectCity.selectedIndex].textContent;

    //Setting Weather Data
    currentTemp.textContent = UnitConvert(weatherData.main.temp, usedUnit.textContent);
    //ovde sam stao
});

unusedUnit.addEventListener('click', (e) => {
    e.preventDefault();
    let uu = usedUnit.textContent;
    let unu = unusedUnit.textContent;

    usedUnit.textContent = unu;
    unusedUnit.textContent = uu;

    currentTemp.textContent = UnitConvert(weatherData.main.temp, usedUnit.textContent);
});