var apiKey = "6d18642e9c95b935e37fbca984ddbf75";
var btn = document.querySelector("#searchBtn");

// Saved city search function on click
$(document).on("click", ".searchedCity", function(event) {
    event.preventDefault();

    var city = $(this).attr("attr");
    citySearch(city);
});

// Weather data from search
var citySearch = function(city) {

    // Variables for current and 5 day weather
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&Appid=" + apiKey + "&units=imperial";
    console.log(urlCurrent)
    var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&Appid=" + apiKey + "&units=imperial";
    console.log(urlFiveDay)

    if (city == "") {
        console.log(city);
    } else {
        $.ajax({url: urlCurrent, method: "GET"}).then(function (response) {
            
            // Current Weather Card
            var currentWeather = $(".currentWeather").append("<div class = 'row'>").addClass("card-body");
            currentWeather.empty();


            // Fix Date 
            var timeUTC = new Date(response.dt * 1000);
            currentWeather.append("<h3 class='col is-size-2 justify-content-start'>" + response.name + " " + timeUTC.toLocaleDateString("en-US") + "</h3>");
            currentWeather.append(`<img class="col-2 justify-content-end" src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
            // Add Temp
            var currentTemp = currentWeather.append("<div class='col'></div>");
            currentWeather.append(currentTemp);
            currentTemp.append("<div class='col-12 is-size-4'>" + "Temperature: " + response.main.temp + "° F" + "</div>");
            // Humidity
            currentTemp.append("<div class='col-12 is-size-4'>" + "Humidity: " + response.main.humidity + "%" + "</div>");
            //Wind Speed: 
            currentTemp.append("<div class='col-12 is-size-4'>" + "Wind Speed: " + response.wind.speed + "mph " + "</div>");

            // All the stuff for the pointless UV index...
            var uvIndex = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;

            // Get UV
            $.ajax({
                url: uvIndex,
                method: "GET"
            }).then(function (response) {

                var uvIndexLevel = response.value
                // UV index: 1 - 2  Green
                if(uvIndexLevel < 3){
                    var currentUV = currentTemp.append("<div class='col-3 bg-success'>" + "UV Index: " + uvIndexLevel + "</div>").addClass("card-text");
                    currentUV.addClass("UV");
                    currentTemp.append(currentUV);
                }
                    else if( uvIndexLevel < 6){
                        var currentUV = currentTemp.append("<div class='col-3 bg-warning'>" + "UV Index: " + uvIndexLevel + "</div>").addClass("card-text");
                        currentUV.addClass("UV");
                        currentTemp.append(currentUV);
                    }
                        else if(uvIndexLevel < 8){
                            var currentUV = currentTemp.append("<div class='col-3 bg-danger'>" + "UV Index: " + uvIndexLevel + "</div>").addClass("card-text");
                            currentUV.addClass("UV");
                            currentTemp.append(currentUV);                
                        }
                            else {
                                var currentUV = currentTemp.append("<div class='col-3 text-white bg-dark'>" + "UV Index: " + uvIndexLevel + "</div>").addClass("card-text");
                                currentUV.addClass("UV");
                                currentTemp.append(currentUV);
                            }
                
            });
        });

        // 5-day forecast
        $.ajax({
            url: urlFiveDay,
            method: "GET"
        }).then(function (response) {
            // Array for 5-days 
            var day = [0, 8, 16, 24, 32];
            var forecastWeather = $(".forecastWeather").addClass("card-body");
            var fiveDayDiv = $(".fiveDayStart").addClass("card-text");
            fiveDayDiv.empty();
            // For each for 5 days
            day.forEach(function (i) {
                var fiveDayUTC1 = new Date(response.list[i].dt * 1000);
                fiveDayUTC1 = fiveDayUTC1.toLocaleDateString("en-US");

                fiveDayDiv.append("<div class='m-1 p-2 fiveDayColor has-background-info has-text-white'>" + "<p>" + fiveDayUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");


            })

        });
    }
};
// Search bar city search
var search = function(event){
    event.preventDefault();

    //getting the value of the input
    var inputElement = document.querySelector("#searchCity");
    var textInput = inputElement.value.trim();

    if(inputElement.value === ""){
        // $("<div title='UH OH!'>You need to enter a city!</div>").dialog();
        modal.classList.add('is-active');
        // return;
    }
    // if the value is a string 
    else{
   
        citySearch(textInput);

    }
};

// Modal stuff
var modalBg = document.querySelector(".modal-background");
var modal = document.querySelector(".modal");

modalBg.addEventListener('click', () => {
    modal.classList.remove('is-active');
});


// listener for search button click
btn.addEventListener("click", search);