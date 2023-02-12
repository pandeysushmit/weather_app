// const express=require("express");
// const https=require("https");
// const app=express();
// app.get("/",function(req,res){
//     // res.send("Server is up and running.");
//     const query="London";
//     const url="https://api.openweathermap.org/data/2.5/weather?lat=29.3732&lon=78.1351&appid=${appid}&units=metric";
//     https.get(url,function(response){
//         console.log(response.statusCode);
//         response.on("data",function(data){
//             // console.log(data);
//             const wdata=JSON.parse(data)
//             // console.log(wdata)
//             const temp=wdata.main.temp;
//             const place=wdata.name;
//             res.write("<p>The location is: "+place+"</p>");
//             const iconurl=" http://openweathermap.org/img/wn/"+wdata.weather[0].icon+"@2x.png";
//             res.write("<img src="+iconurl+">")
//             res.write("<h1>The temperature in the given location is: "+temp+"</h1>")
//             res.send();
//             // console.log("The Temperature at: "+place+" is: "+temp);
//         })
//     })
// })
// app.listen(3000,function(){
//     console.log("Server is running on port 3000");
// })
const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;
const appid="d39e2a245b04464509f43aafeb6f5a3e";
inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${appid}`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${appid}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}
function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;
        wIcon.src="http://openweathermap.org/img/wn/"+info.weather[0].icon+"@2x.png";
        weatherPart.querySelector(".temp .numb").innerText = temp;
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = feels_like;
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});