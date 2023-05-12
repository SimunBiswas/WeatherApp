  
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
    return tempC + "°C";    
    }

const apiKey = "67J5QTB6W6V53QM7BGURA5ZGM"
const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" ;


async function getWeather(city) { 
    

    const response =await fetch(url + city + `?&key=${apiKey}`)
    const data = await response.json();
    console.log(data);
    console.log(data.address)
    document.getElementById("initial-place").innerHTML = data.address;
    const {latitude, longitude} = data;
 
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude], 10); 
   
    const {temp, tempmin, tempmax, humidity,sunset, sunrise, windspeed } = data.days[0];
    document.getElementById("location").innerHTML = data.address;

    const tempC = convertFtoCelciusvalue(temp);
    const max_tempC = convertFtoCelciusvalue(tempmax);
    const min_tempC = convertFtoCelciusvalue(tempmin);
    const sunriseT =convertTimeTo12HrFormat(sunrise);
    const sunsetT = convertTimeTo12HrFormat(sunset);

    
    document.getElementById("temp").innerHTML = tempC;
    document.getElementById("max-temp").innerHTML = max_tempC;
    document.getElementById("min-temp").innerHTML = min_tempC;
    document.getElementById("humidity").innerHTML = humidity + "%";
    document.getElementById("wind").innerHTML = windspeed;
    document.getElementById("sunrise").innerHTML = sunriseT;
    document.getElementById("sunset").innerHTML = sunsetT;
    

}
const submitBtn = document.getElementById('submit-btn');
const locationInput = document.getElementById('location-input');



submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
   getWeather(locationInput.value)
});

getWeather("Delhi");






  
