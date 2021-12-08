const express = require('express');
const fs = require('fs')
const cors = require('cors');
const crypto = require('crypto')
const app =  express();
const axios = require("axios").default;
const serviceStorage = require('./storage/service_storage')
let apiGateway;


//Cette api n est pas termine je dois combine avec une api donnant le code d un aeroport d une ville
//Par exemple : SAW pour sabiha gokcen
//Besoin de ce code d aeroport  pour chercher des billets d avion


const getFlightBooking = async (city, dep_airport) => {
    options.params["departure_airport_code"] = dep_airport
    
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
}

app.use(cors({
    origin: apiGateway
}))
app.use(express.json())

const options = {
  method: 'GET',
  url: 'https://google-flights-search.p.rapidapi.com/search',
  params: {
    departure_airport_code: '',
    arrival_airport_code: 'SAW',
    flight_class: 'Economy'
   },
  headers: {
    'x-rapidapi-host': "google-flights-search.p.rapidapi.com",
    'x-rapidapi-key': "6a3d0da4edmsh679059d4b1303e3p1dc725jsn0536dc8965f5"
  }
};

//app.use(cors())


app.get('/:cityName', async (req, res, next) => {
    const {dep_airport} = req.body;
    return res.status(200).json({flightBooking: await getFlightBooking(req.params.cityName, dep_airport)})

})


app.listen(3044, async () => {
    serviceStorage.saveFile(3044);
    apiGateway = serviceStorage.getApiGateway();
    console.log('FlightBooking Service started and stored');
})