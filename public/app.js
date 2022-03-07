// Create the script tag
const script = document.createElement('script');
 const api_key = process.env.weather_api_key;
script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap`;
script.async = true;
document.head.appendChild(script);

// set up map
window.initMap = function() {
  let lat, lon;
  const myLatlng = { lat: 54.350, lng: 18.645 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
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
    const html1 = `
      <p>Selected coordinates:</p>
      <p>Lat: <span>${lat}°</span></p> 
      <p>Lon: <span>${lon}°</span></p>
      <button id="btn">Find Weather</button>
      `;
    coord.innerHTML = html1;
  }); 
    // post request
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
          const showWeather = document.getElementById('weather_cards');
          const html2 = `
            <div id=card>
              <img src="${imgIcon}">
              <p>Place: <span>${name}</span></>
              <p>Temperature: <span>${temp}</span></>
              <p>Pressure: <span>${pressure}</span></>
              <p>Humidity: <span>${humidity}</span></>
              <p>Date: <span>${date}</span></>
              <p>Time: <span>${time}</span></>
              <p>Air Q: <span>${aiq}</span></>
              <div class="close_btn">
              <img class="close_icon" src="close.svg" alt="close card">
              </div>
            </div>
          `
          showWeather.innerHTML += html2;
          
          // sroll to bottom
          window.scrollTo(0,document.body.scrollHeight); 
        }
    } catch {
        alert('Dupa! Try again');
        console.log('Something went wrong');
        console.error(error);
    }
  });

  // scroll to top
  let btnScroll = document.querySelector(".scroll_icon");
  btnScroll.addEventListener('click', ()=>{
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
  });

  // show scroll button
  document.addEventListener('scroll', ()=>{  
    const topScrollBtn = document.querySelector('.scroll_top_btn');
    const revealPoint = document.querySelector('#card:first-of-type');
    // if (revealPoint === null) {
    //   revealPoint;
    // }
    const top = revealPoint.getBoundingClientRect().top; 
    const height = window.innerHeight;
    if(top + 250 < height) {
        topScrollBtn.style.display = 'block';
    } else {
        topScrollBtn.style.display = 'none';
    }
  }, false);

  // remove card
  document.addEventListener('click', event => {
    if (event.target.matches('.close_icon')) {
      event.target.closest('#card').remove();
    }
  })
};




      

      


  
