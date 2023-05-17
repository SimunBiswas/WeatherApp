  
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

const apiKey = "67J5QTB6W6V53QM7BGURA5ZGM"
const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" ;


async function getWeather(city) { 
    

    const response =await fetch(url + city + `?&key=${apiKey}`)
    const data = await response.json();
    console.log(data);
    document.getElementById("initial-place").innerHTML = data.address;
    const {latitude, longitude} = data;
 
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude], 10); 
   
    const {feelslike, temp, tempmin, tempmax,datetime, humidity,sunset, sunrise, windspeed,icon, description } = data.days[0];
    document.getElementById("initial-place").innerHTML = data.address;
    console.log(icon);
    console.log(description);

    const tempC = convertFtoCelciusvalue(temp);
    const max_tempC = convertFtoCelciusvalue(tempmax);
    const min_tempC = convertFtoCelciusvalue(tempmin);
    const feels_like = convertFtoCelciusvalue(feelslike);
    const sunriseT =convertTimeTo12HrFormat(sunrise);
    const sunsetT = convertTimeTo12HrFormat(sunset);

    document.getElementById("temp").innerHTML = tempC + "°C";
    document.getElementById("max-temp").innerHTML = max_tempC + "°C";
    document.getElementById("min-temp").innerHTML = min_tempC + "°C";
    document.getElementById("feels-like").innerHTML = " " + feels_like;
    document.getElementById("description").innerHTML = description ;
    document.getElementById("humidity").innerHTML = humidity;
    document.getElementById("wind").innerHTML = windspeed ;
    document.getElementById("sunrise").innerHTML = sunriseT;
    document.getElementById("sunset").innerHTML = sunsetT;
    // document.getElementById("input-value").reset();

    const source = chooseIcon(icon);   
    const mainIcon = document.getElementById("main-icon");
    mainIcon.src = source 
    
    document.getElementById("day-1").innerHTML = getDayOfWeek(data.days[1].datetime);
    document.getElementById("day-2").innerHTML = getDayOfWeek(data.days[2].datetime);
    document.getElementById("day-3").innerHTML = getDayOfWeek(data.days[3].datetime);
    document.getElementById("day-4").innerHTML = getDayOfWeek(data.days[4].datetime);

    document.getElementById("main-icon-0").innerHTML.src = chooseIcon(data.days[0].icon);     
    document.getElementById("main-icon-1").innerHTML.src = chooseIcon(data.days[1].icon);     
    document.getElementById("main-icon-2").innerHTML.src = chooseIcon(data.days[2].icon);     
    document.getElementById("main-icon-3").innerHTML.src = chooseIcon(data.days[3].icon);     
    document.getElementById("main-icon-4").innerHTML.src = chooseIcon(data.days[4].icon);  
    
    document.getElementById("max-temp-1").innerHTML = convertFtoCelciusvalue(data.days[1].tempmax);
    document.getElementById("max-temp-01").innerHTML = convertFtoCelciusvalue(data.days[1].tempmax);
    document.getElementById("max-temp-2").innerHTML = convertFtoCelciusvalue(data.days[2].tempmax);
    document.getElementById("max-temp-3").innerHTML = convertFtoCelciusvalue(data.days[3].tempmax);
    document.getElementById("max-temp-4").innerHTML = convertFtoCelciusvalue(data.days[4].tempmax);

    document.getElementById("min-temp-1").innerHTML = convertFtoCelciusvalue(data.days[1].tempmin);
    document.getElementById("min-temp-01").innerHTML = convertFtoCelciusvalue(data.days[1].tempmin);
    document.getElementById("min-temp-2").innerHTML = convertFtoCelciusvalue(data.days[2].tempmin);
    document.getElementById("min-temp-3").innerHTML = convertFtoCelciusvalue(data.days[3].tempmin);
    document.getElementById("min-temp-4").innerHTML = convertFtoCelciusvalue(data.days[4].tempmin);


}
const submitBtn = document.getElementById('submit-btn');
const locationInput = document.getElementById('location-input');



submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
   getWeather(locationInput.value)
});

getWeather("Delhi");






  
