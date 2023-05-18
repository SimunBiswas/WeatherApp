  
let latitude=0;
let longitude=0;


const map = L.map('map', {
    center: [0, 0],
    zoom: 10
});
const attribution= '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tileUrl ='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map);

const marker = L.marker([0, 0]).addTo(map);

map.zoomControl.remove();



function convertTimeTo12HrFormat(time) {
    let hour = parseInt(time.substring(0, 2));
    let minute = time.substring(3,5);
    let ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // convert hour 0 to 12
    let formattedTime = hour + ':' + minute + ' ' + ampm;
    return formattedTime;
  }

function convertFtoCelciusvalue(tempF){
    let tempC = (tempF - 32) * 5 / 9;
    tempC = Math.floor(tempC);
    return tempC ;    
    }



function chooseIcon(icon){
    if(icon === "clear"){
        return "images/sun.png";
    }
    else if(icon === "clear-day"){
        return "images/sun.png";
    }
    else if(icon === "clear-night"){
        return "images/moon.png";
    }
    else if(icon === "rain"){
        return "images/rain.png";
    }
    else if(icon === "snow"){
        return "images/snowflake.png";
    }
    else if(icon === "fog"){
        return "images/fog.png";
    }
    else if(icon === "wind"){
        return "images/storm.png";
    }
    else if(icon === "cloudy"){
        return "images/clouds.png";
    }
    else if(icon === "partly-cloudy-night"){
        return "images/night.png";
    }
    else if(icon === "partly-cloudy-day"){
        return "images/partly-cloudy.png";
    }
}

const currentTime = new Date();
const hours = currentTime.getHours();

function getDayOfWeek(dateString) {
    var dateParts = dateString.split("-");
    var year = parseInt(dateParts[0]);
    var month = parseInt(dateParts[1]) - 1; // months are zero-based
    var day = parseInt(dateParts[2]);
  
    var date = new Date(year, month, day);
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var dayOfWeek = daysOfWeek[date.getDay()];
  
    return dayOfWeek;
  }

  function capitalizeFirstLetter(word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
  }


const apiKey = "67J5QTB6W6V53QM7BGURA5ZGM"
const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" ;


async function getWeather(city) { 
    

    const response =await fetch(url + city + `?&key=${apiKey}`)
    const data = await response.json();
    console.log(data);

    const capitalCityName = capitalizeFirstLetter(data.address);
    document.getElementById("initial-place").innerHTML = capitalCityName ;

    const {latitude, longitude} = data;
 
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude], 10); 
   
    const { tempmin, tempmax, humidity,sunset, sunrise, windspeed,icon, description } = data.days[0];

    const time =  data.days[0].hours;

    for ( i = 0; i < 24; i++) {
        if ( i === hours){
            document.getElementById("temp").innerHTML = convertFtoCelciusvalue(time[i].temp) + "°C";
            document.getElementById("main-icon").src = chooseIcon(time[i].icon);
            document.getElementById("feels-like").innerHTML = " " +convertFtoCelciusvalue(time[i].feelslike) + "°C";

        }
    }

    const max_tempC = convertFtoCelciusvalue(tempmax);
    const min_tempC = convertFtoCelciusvalue(tempmin);
    const sunriseT =convertTimeTo12HrFormat(sunrise);
    const sunsetT = convertTimeTo12HrFormat(sunset);

    document.getElementById("max-temp").innerHTML = max_tempC + "°C";
    document.getElementById("min-temp").innerHTML = min_tempC + "°C";
    document.getElementById("description").innerHTML = description ;
    document.getElementById("humidity").innerHTML = humidity;
    document.getElementById("wind").innerHTML = windspeed ;
    document.getElementById("sunrise").innerHTML = sunriseT;
    document.getElementById("sunset").innerHTML = sunsetT;
    // document.getElementById("input-value").reset();

    

    for ( i = 1; i <=4; i++){
        const day = "day-" + i;
        document.getElementById(day).innerHTML = getDayOfWeek(data.days[i].datetime);  
    }

    for ( i = 0; i < 5; i++){
        const minTempId = "min-temp-" + i;
        const maxTempId = "max-temp-" + i;
        const mainIcon = "main-icon-" + i;
        const hum = "humidity-" + i;

        document.getElementById(mainIcon).src = chooseIcon(data.days[0].icon);
        document.getElementById(minTempId).innerHTML = convertFtoCelciusvalue(data.days[i].tempmin);
        document.getElementById(maxTempId).innerHTML = convertFtoCelciusvalue(data.days[i].tempmax);
        document.getElementById(hum).innerHTML = data.days[i].humidity;

    }



}
const submitBtn = document.getElementById('submit-btn');
const locationInput = document.getElementById('location-input');



submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
   getWeather(locationInput.value)
});



getWeather("delhi");






   
