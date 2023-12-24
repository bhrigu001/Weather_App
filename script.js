// const API_KEY="430ead82640b3c3e4d5ac549e08587c6";

// async function showWeather(){
    // try{
    //     let city="allahabad";
     
    //     const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
    //     const data=await response.json();
    //     console.log("Weather data->", data);
    
    //     let newPara=document.createElement('p');
    //     newPara.textContent=`${data?.main?.temp.toFixed(2)}°C`
        
    //     document.body.appendChild(newPara);
    // }
    // catch(err){
    // //handle the error
    // console.log("Error Found" , err);    
    // }
//     //https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric 
// }

// async function getCustomWeatherDetails(){
//     try{
//         let lati=17.6323;
//         let long=18.3333;
    
//         let result=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&appid=${API_KEY}&units=metric`);
        
//         let data=await result.json();
//         console.log(data);
//     }
//     catch(err){
//         console.log("Error Found" , err);
//     }

// }function getLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//        console.log("Geolocation is not supported by this browser.");
//     }
//   }
  
//   function showPosition(position) {
//     let lati=position.coords.latitude;
//     let longi=position.coords.longitude;


//     console.log(lati);
//     console.log(longi);
//     }


const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorContainer=document.querySelector(".error-container");

 let currentTab=userTab;
 const API_KEY="430ead82640b3c3e4d5ac549e08587c6";
 currentTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab")
    }
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
//now we're in your weather tab so we'll check local storage to 
//know weather we have our coordinate there
        getfromSessionStorage();
    }
}

 userTab.addEventListener("click",()=>{
    switchTab(userTab);}
 );


 searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})


function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
  const {lat,lon}=coordinates;
  //make grant container invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API Call
  try{
             const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
             const data=await response.json();

             loadingScreen.classList.remove("active");
             userInfoContainer.classList.add("active");
             errorContainer.classList.remove("active");
             
             renderWeatherInfo(data);
  }
  catch(err){
    loadingScreen.classList.remove("active");
    console.log("Error Found" , err); 
  }
}


function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherInfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
 else{
    alert("geolocation is not available")
 }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    // errorContainer.classList.remove("active");

    try{
            
        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    
        const data=await response.json();
        if(!response.ok){
            userInfoContainer.classList.remove("active");
            loadingScreen.classList.remove("active");
            errorContainer.classList.add("active");
           

        }
        else{
            errorContainer.classList.remove("active");
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active"); 
             renderWeatherInfo(data);
        }

    }
    catch(err){
    //handle the error
   console.log("Error Found",err);
    }
}









































































