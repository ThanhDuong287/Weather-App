const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    weatherIcons = wrapper.querySelector(".weather-part img"),
    arrowBack = wrapper.querySelector("header i");
let api;

inputField.addEventListener("keyup", e => {
    //if user pressed enter btn and input value is not empty
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else {
        alert("Your browser not support geolocation api");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=7166eef132e9742f73f4f7faf4d5107f`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=7166eef132e9742f73f4f7faf4d5107f`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    infoTxt.classList.replace("pending", "error");
    if (info.cod == "404") {
        infoTxt.innerText = `${inputField.value} is not a valid city`;
    }
    else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;
      
        if (id == 800) {
            weatherIcons.src = "./images/sun.png";
        } else if (id >= 200 && id <= 232) {
            weatherIcons.src = "./images/storm.png";
        } else if ((id >= 300 && id <= 321) || (id >= 520 && id <= 531)) {
            weatherIcons.src = "./images/shower_rain.png";
        } else if (id >= 500 && id <= 504) {
            weatherIcons.src = "./images/rain.png";
        } else if ((id >= 600 && id <= 622) || id == 511) {
            weatherIcons.src = "./images/snow.png";
        } else if (id >= 701 && id <= 781) {
            weatherIcons.src = "./images/mist.png";
        } else if (id == 801) {
            weatherIcons.src = "./images/cloudy.png";
        } else if (id == 802) {
            weatherIcons.src = "./images/scattered_cloud.png";
        } else if (id == 803 || id == 804) {
            weatherIcons.src = "./images/broken-cloud.png";
        }

        //let's pass these values to a particular html element
        wrapper.querySelector(".temp .number").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .number-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
        console.log(info);

    }
}
arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");

})