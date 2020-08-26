$("#cityWeatherDetails").hide()

$("#find-city").on("click", function (event) {
    $("#cityWeatherDetails").show()
    var cityName = $("#city-input").val();

    var today = new Date();
    var date = (today.getMonth() + 1) + ("") + '-' + ("") + today.getDate() + ("") + '-' + ("") + today.getFullYear();
 

    event.preventDefault();

    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=a2d1d70e63ea85ab0e1dec71d8d209c2";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)

        $("#city-name").text("City: " + response.name + " " + date);

        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $("#temp").text("Temperature: " + parseInt(tempF) + "F");

        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#wind").text("Wind: " + response.wind.speed);

        var lat = response.coord.lat
        var lon = response.coord.lon

        UVI(lat, lon)

        save(cityName)
        renderCityList()
        fiveDayForecast(lat, lon)

    });

});

function fiveDayForecast(lat, lon) {

    fiveQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=a2d1d70e63ea85ab0e1dec71d8d209c2";
    $.ajax({
        url: fiveQueryURL,
        method: "GET"
    }).then(function (fiveresponse) {        

        //for loop for five day forecast

        // for (var i = 0; i < 5; i++){
        
        // var arrayIndex = fiveresponse.daily[i]   

        // var box = $("<div>")
        // box.addClass("card border-info mb-3 col-sm-2")
        // $("#forecast-boxes").append(box)

        // var dailyForecastDay1 = $("<h5>").text(arrayIndex.daily[0])
        // console.log(dailyForecastDay1)
        // dailyForecastDay1.addClass("card-title")
        // $("#forecast-boxes").append(dailyForecastDay1)

        // }

        var dailyForecastDay1 = (fiveresponse.daily[0])
        console.log(dailyForecastDay1)
        
        var icon = (dailyForecastDay1.weather[0].icon)

        var imageURL = ("http://openweathermap.org/img/wn/" + icon + "@2x.png")
        iconEl = $("<img>").attr("src", imageURL)

        var tempB = (dailyForecastDay1.temp.day - 273.15) * 1.80 + 32;
        var humidityB = (dailyForecastDay1.humidity)

        $("#icon").append(iconEl)
        $("#tempB").append("Temperature: " + parseInt(tempB) + "F")
        $("#humidityB").append("Humidity: " + humidityB + "%")

    });
}

function UVI(lat, lon) {

    uvQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=a2d1d70e63ea85ab0e1dec71d8d209c2";

    $.ajax({
        url: uvQueryURL,
        method: "GET"
    }).then(function (uvresponse) {
        var uvi = uvresponse.current.uvi
        $("#UV").text("UV Index: " + uvi);
    });
}


function save(city) {

    var history = JSON.parse(localStorage.getItem("saved-cities")) || []
    history.push(city)
    localStorage.setItem("saved-cities", JSON.stringify(history))

}

function renderCityList() {

    var savedData = JSON.parse(localStorage.getItem("saved-cities"))

    $(".list-group").empty()

    for (var i = 0; i < savedData.length; i++) {

        var listItem = $("<li>")
        listItem.addClass("list-group-item")
        listItem.text(savedData[i]);
        $(".list-group").append(listItem)
    }
}
