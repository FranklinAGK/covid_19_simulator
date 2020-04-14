/*var app= require("./estimator.js");

return app;*/
var http = require('http');

const data = JSON.stringify({
region: {
name: "Africa",
avgAge: 19.7,
avgDailyIncomeInUSD: 5,
avgDailyIncomePopulation: 0.71
},
periodType: "days",
timeToElapse: 58,
reportedCases: 674,
population: 66622705,
totalHospitalBeds: 1380614
})


/*http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(data);
  console.log(data);
  res.end();
}).listen(8080);*/


