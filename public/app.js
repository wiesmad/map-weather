// Create the script tag
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${map_api_key}&callback=initMap`;
script.async = true;
document.head.appendChild(script);


window.initMap = function() {
  let lat, lon;
  const myLatlng = { lat: 54, lng: 18 };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center: myLatlng,
      draggableCursor: 'arrow'
    });
    
    map.addListener("click", (ev) => {
  
      new google.maps.Marker({
        position: ev.latLng,
        map,
        title: "Check the weather here",
      });
    
      lat = ev.latLng.lat().toFixed(3);
      lon = ev.latLng.lng().toFixed(3);
      console.log(lat, lon);

      const coord = document.getElementById('coord');
      coord.textContent = `${lat}  ${lon}`;
    }); 

    const btn = document.getElementById('btn');
    btn.addEventListener('click', async event => {
      console.log('req sent');
        const data = { lat, lon };
        const options =  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        const response = await fetch('/api', options);
        const json = await response.json();
        console.log(json);  

        weatherData = json.weather;
            airData = json.air_quality;
            
            let { weather, visibility, wind, main, clouds, name, dt } = weatherData;
            let { temp, pressure, humidity} = main;
            let id = weather[0].id; // weather ID
            let icon = weather[0].icon; // weather icon
            imgIcon = document.createElement('img').src;
            imgIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            dateTime = new Date(dt * 1000).toLocaleString().split(',');
            date = dateTime[0]; // date
            time = dateTime[1]; // time
            visibility; // visibility m
            temp = `${temp} °C`; // temperature °C
            pressure = `${pressure} mmHg`; // pressure mmHg
            humidity = `${humidity} %`; // humidity %
          

            let { list } = airData;
            let air_q =  list[0].main.aqi;
            let aiq = '';

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
          
          // try inner html

          let img = document.getElementById('img');
          let show = document.querySelectorAll('td');
          show[0].textContent = name;
          img.src = imgIcon;
          show[2].textContent = temp;
          show[3].textContent = pressure;
          show[4].textContent = humidity;
          show[5].textContent = date;
          show[6].textContent = time;
          show[7].textContent = aiq;
        
    });
};




      

      


  