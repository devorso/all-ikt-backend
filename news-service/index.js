const express = require('express');
const fs = require('fs')
const cors = require('cors');
const crypto = require('crypto')
const app =  express();
const axios = require('axios')
const JWT= require('jsonwebtoken')
const serviceStorage = require('./storage/service_storage')
let apiGateway;
const secret = "21SD1S11SD1S1S2" // on obtiendra la clé par var env. (process.env.SECRET_KEY)

const getNews = async (city) => {
    const url = ('https://free-news.p.rapidapi.com/v1/search?q=' + city + '&lang=fr');
    const response = await axios.default.get(url, { headers: { 'x-rapidapi-host': "free-news.p.rapidapi.com", 'x-rapidapi-key': "6a3d0da4edmsh679059d4b1303e3p1dc725jsn0536dc8965f5" }});
    console.log(response.data);
    return response.data;
};


app.use(cors({origin: apiGateway}))
app.use((req, res, next) => {
    if (req.headers.authorization === undefined) {
        return res.status(500).json({message:'Authorization field empty !'});
    }
    const token = req.headers.authorization.split(' ')[1]
    if (token) {
       try { 
           const data = JWT.verify(token,secret)
           console.log(data)
           next();
       }catch(err) {
           return res.status(403).json({message:'Forbidden!', error:'access_notfound'})
       }
    }
 
})

app.get('/:cityName', async (req, res, next) => {
    return res.status(200).json({news: await getNews(req.params.cityName)})
})


app.listen(3038, async () => {
    serviceStorage.saveFile(3038);
    apiGateway = serviceStorage.getApiGateway();
    console.log('NewsService started and stored');
})