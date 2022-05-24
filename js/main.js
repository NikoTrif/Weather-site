let place = document.getElementById("place");
let searcher = document.getElementById("searcher");
let apiKey = '8e1cf7d0e536d5b4b9e3ab3ff361aaf5';
let latitude = 44.81;
let longitude = 20.46;
let apiPath = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

let weatherData = fetch(apiPath) //ovde sam stao
console.log(weatherData);

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
        searcher.classList.replace('d-block', 'd-none');
    }
});