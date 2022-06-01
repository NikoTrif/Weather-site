let place = document.getElementById("place");
let searcher = document.getElementById("searcher");
let selectCity = document.getElementById("citySelect");
let usedUnit = document.querySelector('#used-unit');
let unusedUnit = document.querySelector('#unused-unit a');
let currentTemp = document.querySelector('#current-temp');
let selectOption;
let apiKey = '8e1cf7d0e536d5b4b9e3ab3ff361aaf5';
let apiKey2 = 'a043fe65d728314064a9719e20ff126f';
let city;
let cities;
let weatherData;
let forecastData;

// console.log(currentTemp.textContent);

let temp;
let weather = document.querySelector('#current-weather');
let feel = document.querySelector('#current-feeling');
let windSpeed = document.querySelector('#wind-speed');
let windDirection = document.querySelector('#wind-direction');
let pressure = document.querySelector('#pressure');
let humidity = document.querySelector('#humidity');
let visibility = document.querySelector('#visibility');

async function LoadWeather(lat, lon) {
    // let weatherApiPath = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    let forecastApiPath = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey2}`;

    weatherData = await (await fetch(weatherApiPath)).json();
    forecastData = await (await fetch (forecastApiPath)).json();

    console.log("Load Weather -> weatherData:");
    console.log(weatherData);
    console.log("Load Weather -> forecastData:");
    console.log(forecastData);
    
    //Setting Weather Data
    console.log('SelectCity -> Click:');
    currentTemp.textContent = UnitConvert(weatherData.main.temp, usedUnit.textContent);
    weather.textContent = weatherData.weather[0].main;
    feel.textContent = UnitConvert(weatherData.main.feels_like, usedUnit.textContent);
    windSpeed.textContent = weatherData.wind.speed;
    windDirection.textContent = weatherData.wind.deg;
    pressure.textContent = weatherData.main.pressure;
    humidity.textContent = weatherData.main.humidity;
    visibility.textContent = weatherData.visibility;
    //kada se napravi CSS, dodati promenu pozadine u odnosu na vreme
    
    //dodati prognozu za 5 dana
    let day = {
        one: {
            icon: "",
            max: '',
            min: '',
            wth: ''
        },
        two: {
            icon: "",
            max: '',
            min: '',
            wth: ''
        },
        three: {
            icon: "",
            max: '',
            min: '',
            wth: ''
        },
        four: {
            icon: "",
            max: '',
            min: '',
            wth: ''
        },
        five: {
            icon: "",
            max: '',
            min: '',
            wth: ''
        }
    };

    // day.one.max = await forecastData.filter(e => {
    //     return e.list.dt?.includes(Date.prototype.setDate((Date(Number(Date))+ 1)).toFixed());
    // });

    // console.log('Load Weather -> day oe max');
    // console.log(day.one.max);

    console.log('Load Weather -> Days');
    forecastData.forEach(list.dt, (e) => {
        console.log(e);
    });

}

async function LoadCities() {
    let jsonconn = await fetch('js/worldcities.json');

    cities = await jsonconn.json();
    console.log("LOAD CITIES -> cities:");
    console.log(cities);
}

function UnitConvert(tempVal, unit) {
    let tempConverted;

    switch(unit) {
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
    if(e.key === 'Enter') {
        console.log('enter');
        console.log(searcher.value);
        selectCity.selectedIndex = 0;
        selectCity.click();
        searcher.classList.replace('d-block', 'd-none');
        searcher.value = null;
    }
});

searcher.addEventListener('keyup', function() {
    let searcherVal = searcher.value.replaceAll(',', '$').replaceAll('$ ', '$').split('$');
    console.log(`Searcher - > KeyUP - > SearcherVal: `);
    console.log(searcherVal);
    // new Set u ES6 spaja array ali ne duplira vrednosti
    city = [...new Set([...cities.filter(ea => {
            return ea.city.toLowerCase().includes(searcherVal[0].toLowerCase());
        }),
        ...cities.filter(eb => {
            return eb.admin_name?.toLowerCase()?.includes(searcherVal[0].toLowerCase());
        }),
        ...cities.filter(ec => {
            return ec.city_ascii?.toLowerCase()?.includes(searcherVal[0].toLowerCase());
        })])
    ];
    if(searcherVal.length > 1){
        city = city.filter(e => {
            return e.country.toLowerCase().includes(searcherVal[1].toLowerCase());
        })
    }

    console.log(`Searcher - > KeyUP - > City: `);
    console.log(city);
    selectCity.innerHTML = '';
    if(city.length > 0 && city.length < 10) {
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

selectCity.addEventListener('click', () => {
    let coordinates = selectCity.value.split(',');
    console.log(selectCity.value);

    LoadWeather(coordinates[0], coordinates[1]);

    selectCity.classList.replace('d-block', 'd-none');
    searcher.classList.replace('d-block', 'd-none');
    searcher.value = null;

    place.innerHTML = selectCity.options[selectCity.selectedIndex].textContent;
});

unusedUnit.addEventListener('click', (e) => {
    e.preventDefault();
    let uu = usedUnit.textContent;
    let unu = unusedUnit.textContent;

    usedUnit.textContent = unu;
    unusedUnit.textContent = uu;

    currentTemp.textContent = UnitConvert(weatherData.main.temp, usedUnit.textContent);
    feel.textContent = UnitConvert(weatherData.main.feels_like, usedUnit.textContent);
    document.querySelector('#feeling-unit').textContent = usedUnit.textContent;
});