// Create the script tag
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAH9A5stmnZK6MnwdwgysjQhk_8N1pKlLQ&callback=initMap`;
script.async = true;
document.head.appendChild(script);

window.initMap = function() {
  let lat, lon;
  const myLatlng = { lat: 54, lng: 18 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: myLatlng,
    draggableCursor: 'crosshair'
  });
  // get coordinates on click
  map.addListener("click", (ev) => {
    new google.maps.Marker({
      position: ev.latLng,
      map,
      title: "Check the weather here",
    });
  
    lat = ev.latLng.lat().toFixed(3);
    lon = ev.latLng.lng().toFixed(3);
    
    // render selected coordinates
    const coord = document.getElementById('coord');
    const html1 = `<p>Selected coordinates - Lat: ${lat}°, Lon: ${lon}°</p>
                  <button id="btn">Get Weather</button>`;
    coord.innerHTML = html1;
  }); 
    
    document.addEventListener('click', async event => {
      try {
        if (event.target.matches('#btn')) {
          console.log('req sent');
          const data = { lat, lon };
          const options =  {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          };
          // handling response
          const response = await fetch('/api', options);
          const json = await response.json();
          console.log(json);  

          weatherData = json.weather;
          airData = json.air_quality;

          let { weather, visibility, wind, main, clouds, name, dt } = weatherData;
          let { temp, pressure, humidity} = main;
          let id = weather[0].id; // weather ID
          let icon = weather[0].icon; // weather icon
          imgIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
          dateTime = new Date(dt * 1000).toLocaleString().split(',');
          date = dateTime[0]; // date
          time = dateTime[1]; // time
          visibility; // visibility m
          temp = `${temp} °C`; // temperature °C
          pressure = `${pressure} mmHg`; // pressure mmHg
          humidity = `${humidity} %`; // humidity 

          let { list } = airData;
          let air_q =  list[0].main.aqi;
          let aiq = ''
          switch(air_q) {
            case 1:
                aiq = 'Good';
                break;
            case 2:
                aiq = 'Fair';
                break;
            case 3:
                aiq = 'Moderate';
                break;
            case 4:
                aiq = 'Poor';
                break;
            case 5:
                aiq = 'Very Poor';
                break;
          }

          // render weather data
          const showWeather = document.getElementById('weather');
          const html2 = `
          <img src="${imgIcon}">
          <p>Place: ${name}</>
          <p>Temperatur: ${temp}</>
          <p>Pressure: ${pressure}</>
          <p>Humidity: ${humidity}</>
          <p>Date: ${date}</>
          <p>Time: ${time}</>
          <p>Air Q: ${aiq}</>
          `
          showWeather.innerHTML += html2;
        }
    } catch {
        console.log('Something went wrong');
        console.error(error);
    }
  });
};




      

      


  