$(document).ready(function(){ // Firs opening page
    var cityList=localStorage.getItem("list");
    var list=JSON.parse(cityList);

    if (list==null){
        list = {};
    }

    $("#today").hide();
    $("#forecastPart").hide();

    $("#search").on("click", function(event){
    event.preventDefault();

    var city =$("#city")

    if (city !="") {
    list[city]=true;

    localStorage.setItem("list", JSON.stringify(list));
    WeatherFiveDay(city, list); //Call the 5 day and today weather knowledges
    
        $("#today").show(); //Today part of the web site
        $("#forecastPart").show(); // Forecast part of the web side
    }
    });

    $("#list").on("click", function(event){
    event.preventDefault();
    var city=$(this).text();

    WeatherFiveDay();
    
        $("#today").show();
        $("#forecastPart").show();

    });

});

function WeatherFiveDay(){ // today and five day function
 
    var nowURL = 'https://api.openweathermap.org/data/2.5/weather?q=' +city.value +'&appid=fcf6c44c03e26f65adda9f1456a95829';
    var futureURL = 'https://api.openweathermap.org/data/2.5/forecast?q='+city.value+'&appid=fcf6c44c03e26f65adda9f1456a95829';
      
    $.ajax({url:nowURL, method: "GET"})
    .then(function(weather) {
        
        var cityName = $("<h3>").text(city.value);
        $("#city-name").empty();
        $("#city-name").append(cityName);
           
        var nowMoment = moment();
        var displayMoment = $("<h3>");
        $("#city-date").empty();
        $("#city-date").append(
          displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
        );

        var weatherIcon = $("<img>");
        weatherIcon.attr(
          "src",
          "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
        );
        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);
  
        $("#current-temp").text("Temperature: " + Number(1.8*(weather.main.temp-273)+32).toFixed(2) + " °F"); //I made some calculation to evaulate F degree instead of K.
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

        latitude = weather.coord.lat;
        longitude = weather.coord.lon;
        
        var uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ latitude+"&lon="+longitude+"&exclude=daily&appid=fcf6c44c03e26f65adda9f1456a95829";
        
        $.ajax({url: uvURL, method: "GET"})
        .then(function(uvIndex) {
            console.log(uvIndex);
    
            var uvIndexDisplay = $("<button>");
            uvIndexDisplay.addClass("btn btn-danger");
    
            $("#current-uv").text("UV Index: ");
            $("#current-uv").append(uvIndexDisplay.text(uvIndex.current.uvi));
            console.log(uvIndex.current.uvi);

            $.ajax({
                url: futureURL,
                method: "GET"
               
              }).then(function(forecast) {
                            
                for (var i = 1; i < 6; i ++) {
                  var forecastDate = $("<h5>");
      
                  var forecastPosition = i;
                    
                    $("#forecast-date" + forecastPosition).empty();
                    $("#forecast-date" + forecastPosition).append(forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY")));
      
                    var forecastIcon = $("<img>");
                    forecastIcon.attr("src", "https://openweathermap.org/img/w/" + forecast.list[i].weather[0].icon + ".png" );
      
                    $("#forecast-icon" + forecastPosition).empty();
                    $("#forecast-icon" + forecastPosition).append(forecastIcon);
                    $("#forecast-temp" + forecastPosition).text("Temp: " + Number(1.8*(forecast.list[i].main.temp-273)+32).toFixed(2) + " °F" ); //I made some calculation to evaulate F degree instead of K.
                    $("#forecast-humidity" + forecastPosition).text("Humidity: " + forecast.list[i].main.humidity + "%");
                    $(".forecast").attr("style", "color:white; background-color:blue");
                }                                                           
              });
        });
    });
}

