@echo off

start cmd.exe /k "cd APIGateway && npm start"
start cmd.exe /k "cd user-service && npm start"
start cmd.exe /k "cd meteo-service && npm start"
start cmd.exe /k "cd allaboutcity-service && npm start"
start cmd.exe /k "cd location-service && npm start"
start cmd.exe /k "cd cityinfo-service && npm start"
start cmd.exe /k "cd search-allaboutcity-service && npm start"

echo All services are started. IKnowTravel started to help people !

PAUSE
