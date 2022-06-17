let place = document.getElementById("place");
let searcher = document.getElementById("searcher");
let selectCity = document.getElementById("citySelect");
let usedUnit = document.querySelector('#used-unit');
let unusedUnit = document.querySelector('#unused-unit a');
let currentTemp = document.querySelector('#current-temp');
let body = document.querySelector('body');
let selectOption;
let apiKey = '8e1cf7d0e536d5b4b9e3ab3ff361aaf5';
let apiKey2 = 'a043fe65d728314064a9719e20ff126f';
let city;
let cities;
let coordinates = [44.81, 20.46];
let weatherData;
let forecastData;
// let forecast;

// console.log(currentTemp.textContent);

let temp;
let weather = document.querySelector('#current-weather');
let feel = document.querySelector('#current-feeling');
let windSpeed = document.querySelector('#wind-speed');
let windDirection = document.querySelector('#wind-direction');
let pressure = document.querySelector('#pressure');
let humidity = document.querySelector('#humidity');
let visibility = document.querySelector('#visibility');

LoadCities();
LoadWeather(coordinates[0], coordinates[1]);

//////////////////////////// CONSTRUCTORS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

class MiniMax {
    constructor() {
        this.date = new Date();
        this.min = 1000;
        this.max = 0;
        this.icon = '';
    }
}

//////////////////////////// MAIN FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

async function LoadWeather(lat, lon) {
    let weatherApiPath = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    weatherData = await (await fetch(weatherApiPath)).json();

    console.log("Load Weather -> weatherData:");
    console.log(weatherData);

    //Setting Weather Data
    currentTemp.textContent = UnitConvert(weatherData.main.temp, usedUnit.textContent);
    weather.textContent = weatherData.weather[0].main;
    feel.textContent = UnitConvert(weatherData.main.feels_like, usedUnit.textContent);
    windSpeed.textContent = weatherData.wind.speed;
    windDirection.textContent = weatherData.wind.deg;
    pressure.textContent = weatherData.main.pressure;
    humidity.textContent = weatherData.main.humidity;
    visibility.textContent = weatherData.visibility;

    body.removeAttribute('class');
    body.classList.add(SetBackground(weatherData.weather[0].id, new Date(weatherData.sys.sunrise * 1000), new Date(weatherData.sys.sunset * 1000)));
    //kada se napravi CSS, dodati promenu pozadine u odnosu na vreme

    //dodati prognozu za 5 dana
    await LoadForecast(lat, lon);
}

async function LoadForecast(lat, lon) {
    let forecastApiPath = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=currrent,hourly,minutely&appid=${apiKey2}`;
    let tableBodyRow = document.querySelectorAll('.forecast-5 table tbody tr');
    forecastData = await (await fetch(forecastApiPath)).json();

    tableBodyRow.forEach(e => {
        e.innerHTML = '';
    })

    console.log("Load Forecast -> forecastData:");
    console.log(forecastData);

    // let i = 1;
    // forecast = forecastData.list.filter(e => {
    //     let dt = new Date(e.dt * 1000);
    //     if (dt.getDate() == new Date().getDate() + i) {
    //         i++;
    //         return e;
    //     }
    // });

    // Setting Min and Max Temperature
    let fcst = new MiniMax();
    let fcstArray = [];
    i = 0;

    forecastData.list.forEach((e, index) => {
        let dt = new Date(e.dt * 1000);
        let dt2 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        let danas = new Date();
        let danas2 = new Date(danas.getFullYear(), danas.getMonth(), danas.getDate() + i);

        if (dt2 > danas2) {
            fcstArray.push(fcst);
            fcst = new MiniMax();
            console.log("NOVI DAN");
            i++;
        }

        if (dt2 >= danas2) {
            if (e.main.temp_max > fcst.max) {
                fcst.max = e.main.temp_max;
            }
            if (e.main.temp_min < fcst.min) {
                fcst.min = e.main.temp_min;
            }

            fcst.date = dt2;

            if(dt.getUTCHours() === 12){
                fcst.icon = e.weather[0].icon;
            }
        }        

        if (index === forecastData.list.length - 1) {
            fcstArray.push(fcst);
            fcstArray.shift();
        }
    });

    console.log("Load Forecast -> fcstArray:");
    console.log(fcstArray);
    // console.log("Load Forecast -> forecast:");
    // console.log(forecast);

    let y = 0;
    // Writing forecast table:
    document.querySelectorAll('table .table-header tr .col').forEach(e => {
        e.textContent = new Date(fcstArray[y]?.date).toLocaleString('en', { weekday: 'long' });
        y++;
    });

    // forecast.forEach(e => {
    //     tableBodyRow[0].innerHTML = tableBodyRow[0].innerHTML + `<td><img src="http://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png"></td>`;
    //     tableBodyRow[1].innerHTML = tableBodyRow[1].innerHTML + `<td>Max:<br>${UnitConvert(e.main.temp_max, usedUnit.textContent)}° ${usedUnit.textContent}</td>`;
    //     tableBodyRow[2].innerHTML = tableBodyRow[2].innerHTML + `<td>Min:<br>${UnitConvert(e.main.temp_min, usedUnit.textContent)}° ${usedUnit.textContent}</td>`;
    // });
    fcstArray.forEach(e => {
        tableBodyRow[0].innerHTML = tableBodyRow[0].innerHTML + `<td><img src="http://openweathermap.org/img/wn/${e.icon}@2x.png"></td>`;
        tableBodyRow[1].innerHTML = tableBodyRow[1].innerHTML + `<td>Max:<br>${UnitConvert(e.max, usedUnit.textContent)}° ${usedUnit.textContent}</td>`;
        tableBodyRow[2].innerHTML = tableBodyRow[2].innerHTML + `<td>Min:<br>${UnitConvert(e.min, usedUnit.textContent)}° ${usedUnit.textContent}</td>`;
    })
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
    // console.log('UNIT CONVERT -> tempConverted');
    // console.log(`${tempConverted} ${unit}`);
    return tempConverted;
}

function SetBackground(weatherID, dawn, dusk) {
    let weatherCondition = '';
    let daytime = '';
    let firstNum = 0;
    let sad = new Date();


    if(weatherID === 800 || weatherID === 801 || weatherID === 802){
        firstNum = 800;
    }
    else{
        firstNum = Number(String(weatherID)[0]);
    }

    // className construction FIRST part
    switch (firstNum) {
        case 2:
            weatherCondition = 'thunderstorm'
            break;
        case 3:
            weatherCondition = 'rainy'
            break;
        case 5:
            weatherCondition = 'rainy'
            break;
        case 6:
            weatherCondition = 'snow'
            break;
        case 7:
            weatherCondition = 'misty'
            break;
        case 800:
            weatherCondition = 'clear'
            break;
        case 8:
            weatherCondition = 'cloudy'
            break;
    
        default:
            weatherCondition = 'clear'
            break;
    }

    // className construction SECOND part
    if(sad >= dawn && sad < dusk){
        daytime = 'day';
    }
    else{
        daytime = 'night'
    }


    return `${weatherCondition}-${daytime}`;
}

//////////////////////////// EVENTS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

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

searcher.addEventListener('keyup', function() {
    let searcherVal = searcher.value.replaceAll(',', '$').replaceAll('$ ', '$').split('$');
    console.log(`Searcher - > KeyUP - > SearcherVal: `);
    console.log(searcherVal);
    // new Set u ES6 spaja array i ne duplira vrednosti
    city = [...new Set([...cities.filter(ea => {
            return ea.city.toLowerCase().includes(searcherVal[0].toLowerCase());
        }),
        ...cities.filter(eb => {
            return eb.admin_name?.toLowerCase()?.includes(searcherVal[0].toLowerCase());
        }),
        ...cities.filter(ec => {
            return ec.city_ascii?.toLowerCase()?.includes(searcherVal[0].toLowerCase());
        })
    ])];
    if (searcherVal.length > 1) {
        city = city.filter(e => {
            return e.country.toLowerCase().includes(searcherVal[1].toLowerCase());
        })
    }

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

selectCity.addEventListener('click', () => {
    coordinates = selectCity.value.split(',');
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
    LoadForecast(coordinates[0], coordinates[1]);
});