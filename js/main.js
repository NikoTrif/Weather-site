let place = document.getElementById("place");
let searcher = document.getElementById("searcher");
//let cities;
let searchVal = '';
let apiKey = '8e1cf7d0e536d5b4b9e3ab3ff361aaf5';
let lat = 44.81;
let lon = 20.46;
let apiPath = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
//`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

async function LoadWeather() {
    // let jsonconn = new XMLHttpRequest();
    // jsonconn.open("GET", 'js/cities.json');
    // jsonconn.send(null);
    // jsonconn.onload = () => {
    //     cities = JSON.parse(jsonconn.responseText);
    //     console.log(cities);
    // }

    // jsonconn.onerror = e => {
    //     console.error();
    // }

    let weatherData = await fetch(apiPath);
    let dat = await weatherData.json();
    console.log("Load Weather -> dat:");
    console.log(dat);
}

async function LoadCities() {
    let jsonconn = await fetch('js/cities.json');

    let cities = await jsonconn.json();
    console.log("LOAD CITIES -> cities:");
    console.log(cities);

    let city = await cities.features.filter(e => e.properties.NAME == 'HOUSTON')

    console.log("Load Cities -> City:");
    console.log(city);
    console.log("Load Cities -> Coordinates:");
    console.log(city[0].geometry.coordinates[0][0]);

}
LoadCities();
LoadWeather();
//let weatherData = fetch(apiPath)
//console.log(weatherData);

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
});