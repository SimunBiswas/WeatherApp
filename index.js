// import Chart from 'chart.js/auto';
// import ChartDataLabels from 'chartjs-plugin-datalabels';


Chart.register(ChartDataLabels);

let latitude = 0;
let longitude = 0;

const map = L.map('map', {
    center: [0, 0],
    zoom: 10
});
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map);

const marker = L.marker([0, 0]).addTo(map);

map.zoomControl.remove();

function convertTimeTo12HrFormat(time) {
    let hour = parseInt(time.substring(0, 2));
    let minute = time.substring(3, 5);
    let ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // convert hour 0 to 12
    let formattedTime = hour + ':' + minute + ' ' + ampm;
    return formattedTime;
}

function convertFtoCelciusvalue(tempF) {
    let tempC = (tempF - 32) * 5 / 9;
    tempC = Math.floor(tempC);
    return tempC;
}

function chooseIcon(icon) {
    switch (icon) {
        case "clear":
        case "clear-day":
            return "icons/sun.png";
        case "clear-night":
            return "icons/moon.png";
        case "rain":
            return "icons/rain.png";
        case "snow":
            return "icons/snowflake.png";
        case "fog":
            return "icons/fog.png";
        case "wind":
            return "icons/storm.png";
        case "cloudy":
            return "icons/clouds.png";
        case "partly-cloudy-night":
            return "icons/cloudy-night.png";
        case "partly-cloudy-day":
            return "icons/cloudy-day.png";
        default:
            return "icons/default.png";
    }
}
function chooseBg(icon) {
    switch (icon) {
        case "clear":
        case "clear-day":
            return "images/clear_day.png";
        case "clear-night":
            return "images/clear_night.png";
        case "rain":
            return "images/rainy_day.png";
        case "snow":
            return "images/snow_weathers.png";
        case "fog":
            return "images/foggy_weather.png";
        case "wind":
            return "images/wind_weather.png";
        case "cloudy":
            return "images/clear_day.png";
        case "partly-cloudy-night":
            return "images/cloud_at_night.png";
        case "partly-cloudy-day":
            return "images/cloudy_day.png";
        default:
            return "images/default.png";
    }
}

function getDayOfWeek(dateString) {
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // months are zero-based
    const day = parseInt(dateParts[2]);

    const date = new Date(year, month, day);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const apiKey = "67J5QTB6W6V53QM7BGURA5ZGM";
const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

const weekDays = ["0", "Today"];
const tempEachDay = { temp: [], hum: [], windspeed: [], icon :[] };

async function getWeather(city) {
    try {
        const response = await fetch(url + city + `?&key=${apiKey}`);
        const data = await response.json();


        if (!data || !data.days) {
            throw new Error("Invalid weather data.");
        }

        const capitalCityName = capitalizeFirstLetter(data.address);
        document.getElementById("initial-place").innerHTML = capitalCityName;


        const { latitude, longitude } = data;

        if (latitude && longitude) {
            marker.setLatLng([latitude, longitude]);
            map.setView([latitude, longitude], 10);
        }

 
        const time = data.days[0].hours;

        const currentTime = new Date();
        const hours = currentTime.getHours();

        // Format the month directly
        const monthName = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(currentTime); // "January", "February", etc.
        const dayOfWeek = new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(currentTime); // "Monday", "Tuesday", etc.

        const currentDay = `${currentTime.getHours()}:${currentTime.getMinutes()} - ${dayOfWeek},  ${currentTime.getDate()} ${monthName} '${String(currentTime.getFullYear()).slice(-2)} `;
        document.getElementById("currentDay").innerHTML = currentDay  


        for (let i = 0; i < 24; i++) {
            if (i === hours) {
                document.getElementById("temp").innerHTML = convertFtoCelciusvalue(time[i].temp) + "°";
                document.getElementById("main-icon").src = chooseIcon(time[i].icon);
                document.getElementById("feels-like").innerHTML = " " + convertFtoCelciusvalue(time[i].feelslike) + "°";
            }
        }


        const { tempmin, tempmax, humidity, sunset, sunrise, windspeed, icon, description, cloudcover } = data.days[0];

        document.body.style.backgroundImage = `url(${chooseBg(icon)})`


        const max_tempC = convertFtoCelciusvalue(tempmax);
        const min_tempC = convertFtoCelciusvalue(tempmin);
        const sunriseT = convertTimeTo12HrFormat(sunrise);
        const sunsetT = convertTimeTo12HrFormat(sunset);

        document.getElementById("tempmax").innerHTML = max_tempC + "°C";
        document.getElementById("tempmin").innerHTML = min_tempC + "°C";
        document.getElementById("description").innerHTML = description.toUpperCase();
        document.getElementById("humidity").innerHTML = humidity + "%";
        document.getElementById("cloudcover").innerHTML = cloudcover + "%";
        document.getElementById("windspeed").innerHTML = windspeed + " km/hr";
        document.getElementById("sunrise").innerHTML = sunriseT;
        document.getElementById("sunset").innerHTML = sunsetT;

        weekDays.length = 1; // Reset weekDays array
            
        document.getElementById("temp-0").innerHTML = convertFtoCelciusvalue(data.days[0].temp) + "°c";

        for (let i = 1; i <= 7; i++) {

            const dayOfWeek = getDayOfWeek(data.days[i].datetime);
            // document.getElementById("day-" + i).innerHTML = dayOfWeek;
            weekDays.push(dayOfWeek);
        }

        weekDays[0] = "Today"

        tempEachDay.length = 0;

        const box = weekDays.map((weekDays, i) => {


                return `
                <div class="col">
                    <div class="inside-col">
                        <p id="day-${i}">${i === 0 ? weekDays : weekDays.substring(0, 3)}</p>
                    </div>
                    <div class="inside-col">
                        <img id="main-icon-${i}" src=${chooseIcon(data.days[i].icon)} width="40" height="auto">
                    </div>
                    <div>
                        <p><span id="temp-${i}">${convertFtoCelciusvalue(data.days[i].temp) + "°c"}</span></p>
                    </div>
                </div>
                `
            }
        )

        document.getElementById("box-container").innerHTML = box.join(' ')


        // for (let i = 0; i < 5; i++) {
            
        //     console.log(weekDays[i], i)


        //     document.getElementById("day-" + i).innerHTML = weekDays[i]
        //     document.getElementById("temp-" + i).innerHTML = convertFtoCelciusvalue(data.days[i].temp) + "°c"
        //     document.getElementById("main-icon-" + i).src = chooseIcon(data.days[i].icon)
        // }

        // for (let i = 0; i < 5; i++) {
        //     const minTempId = "min-temp-" + i;
        //     const maxTempId = "max-temp-" + i;
        //     const mainIcon = "main-icon-" + i;
        //     const hum = "humidity-" + i;
        

        //     if (data.days[i] && data.days[i].icon) {
        //         document.getElementById(mainIcon).src = chooseIcon(data.days[i].icon);
        //     }
        //     document.getElementById(minTempId).innerHTML = convertFtoCelciusvalue(data.days[i].tempmin);
        //     document.getElementById(maxTempId).innerHTML = convertFtoCelciusvalue(data.days[i].tempmax);
        //     document.getElementById(hum).innerHTML = data.days[i].humidity;

        //     tempEachDay.temp.push(convertFtoCelciusvalue(data.days[i].temp));
        //     tempEachDay.hum.push(data.days[i].humidity)
        //     tempEachDay.windspeed.push(data.days[i].windspeed)
        //     tempEachDay.icon.push(chooseIcon(data.days[i].icon))

        // }

        // updateWeatherChart();

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}


let weatherChart;

function updateWeatherChart() {
    
    const ctx = document.getElementById('weatherGraph').getContext('2d');

    if (weatherChart) {
        weatherChart.destroy(); // Destroy the old chart if it exists
    }
    const labels = ["0", "Today"];

    // Replace missing Y-values with `null`


    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weekDays,
            datasets: [{
                label: 'Temperature (°C)',
                data: tempEachDay.temp,
                borderColor: '#FFC355',
                backgroundColor: '#D69E36',
                borderWidth: 2,
                
                tension: 0.4,
                datalabels: {
                    labels : {
                        index : {
                            color: '#fff',  // Label color
                            align: 'top',  // Align the data label to the top of each data point
                            anchor: 'end',  // Position the label at the end of each data point
                            margin : 30,
                            padding : 10,
                            font: {
                                weight: 'normal',
                                size: 30
                            },
                            formatter: (value, context) => {
                                const index = context.dataIndex
                                return `${value} °c \n` + `${tempEachDay.hum[index]}%`
                            } 
                        },
                         value: {
                            align: 'bottom',
                            backgroundColor: function(ctx) {
                                var value = ctx.dataset.data[ctx.dataIndex];
                                return value > 50 ? 'white' : null;
                            },
                             font: {
                                weight: 'normal',
                                size: 20

                            },
                            color: function(ctx) {
                                var value = ctx.dataset.data[ctx.dataIndex];
                                return value > 50
                                    ? ctx.dataset.backgroundColor
                                    : 'white';
                            },
                            formatter: function(value, ctx) {
                                const index = ctx.dataIndex
                                return ctx.active
                                    ? 'value'
                                    : `${tempEachDay.windspeed[index]} km/hr\n`
                            },
                            padding: 10
                        }
                    }
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
             datasets: [{


            // borderColor: 'transparent', // Removes border color

            // or

            borderWidth: 0 // Sets border width to 0

        }],

            scales: {
                x: {
                    display: false,
                    beginAtZero: true,
                    ticks: {
                        padding: 30, // Adds padding to x-axis labels
                        margin: 30
                    },
                    grid: {
                        display: false,
                        drawBorder: false, // Remove outer border of the X-axis
                    }
                },
                y: {
                    display: true,
                    ticks: {
                        stepSize: 10, // Adjust the y-axis scale
                        padding: 40, // Adds padding to x-axis labels
                        margin: 30,
                        color: "#D69E36"
                    },
                    grid : {
                        display: false,
                        drawBorder: false, // Remove outer border of the X-axis
                    }
                }
            },
            layout: {
                padding: {
                    left: 10 // Add left padding for the graph
                }
            },
            
            plugins: {
                // chartAreaBorder:{
                //     borderColor: 'transparent',
                // },

                legend: {
                    display: false,
                    // position: 'top'
                },
                datalabels: {
                    display: true, // Ensure the datalabels plugin is enabled
                    align: 'top', // Align labels above data points
                    anchor: 'end', // Anchor labels to the right of the points
                    textAlign: 'center',

                },
                tooltip: {
                    enabled: false // Disable tooltips
                }
            },
            elements: {
               
                line: {
                    borderWidth: 2 // Customize the line width
                }
            },
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const locationInput = document.getElementById('location-input');

    locationInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("submit-btn").click();
        }
    })

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        getWeather(locationInput.value);
    });

    getWeather("delhi");

    const form = document.querySelector('form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        try {
            const results = provider.search({ query: locationInput.value });
            console.log(results)
            // if (results && results.length > 0) {
            //     const { x, y } = results[0]; // Longitude and latitude
            //     marker.setLatLng([y, x]);
            //     map.setView([y, x], 10);
            // } else {
            //     alert("No results found for the entered location.");
            // }
        } catch (error) {
            console.error("Error performing the search:", error);
        }
    })
});



// import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

const form = document.querySelector('form');
const input = form.getElementById('location-input');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if(!input.value){
    input.value = "delhi"
  }
  console.log(input.value)

  const results = await provider.search({ query: input.value });
  console.log(results); // » [{}, {}, {}, ...]
});