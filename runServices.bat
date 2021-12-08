@echo off

start cmd.exe /k "cd APIGateway && npm i && npm start"
start cmd.exe /k "cd user-service &&  npm i && npm start"
start cmd.exe /k "cd meteo-service &&  npm i && npm start"
start cmd.exe /k "cd allaboutcity-service &&  npm i && npm start"
start cmd.exe /k "cd location-service &&  npm i && npm start"
start cmd.exe /k "cd cityinfo-service &&  npm i && npm start"
start cmd.exe /k "cd search-allaboutcity-service &&  npm i && npm start"
start cmd.exe /k "cd news-service &&  npm i && npm start"


echo All services are started. IKnowTravel started to help people !

PAUSE
