var express = require("express");
const fs = require('fs');
var app = express();
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
var data;

const covid19ImpactEstimator = (data) =>
{
	const currentlyInfected= data.reportedCases *10;
	const severeImpactCurrentlyInfected= data.reportedCases *50;
	// demo day for testing is 58 as ref in the data json object,  this can be changed later. 
	var inputDays=data.timeToElapse;
	var sample=Math.floor(inputDays/3);
	//convert to whole number
	const infectionsByRequestedTime= currentlyInfected*Math.pow(2, sample);
	const infectionsByRequestedTime_severe= severeImpactCurrentlyInfected*Math.pow(2, sample);
	//15% is also 
	const severeCasesByRequestedTime=Math.floor(0.15*infectionsByRequestedTime);
	const severeCasesByRequestedTime_severe=Math.floor(0.15*infectionsByRequestedTime_severe);

	//Free beds space impact/ severe
	//according to data 35% of beds are extimated to be free 35% = 0.35;
	const freeBeds=Math.floor(0.35*data.totalHospitalBeds);
	const hospitalBedsByRequestedTime= freeBeds-severeCasesByRequestedTime;
	const hospitalBedsByRequestedTime_severe= freeBeds-severeCasesByRequestedTime_severe;
	//ICU
	const casesForICUByRequestedTime=Math.floor(0.05*infectionsByRequestedTime);
	const casesForICUByRequestedTime_severe=Math.floor(0.05*infectionsByRequestedTime_severe);
	//vent
	const casesForVentilatorsByRequestedTime=Math.floor(0.02*infectionsByRequestedTime);
	const casesForVentilatorsByRequestedTime_severe=Math.floor(0.02*infectionsByRequestedTime_severe);
	//dollarsInFlight
	//65% of the region (the majority) earn average pay from data
	var dollarsInFlight=0.65*infectionsByRequestedTime;
	dollarsInFlight=dollarsInFlight*data.region.avgDailyIncomeInUSD;
	dollarsInFlight=Math.floor(dollarsInFlight/data.timeToElapse);

	var dollarsInFlight_severe=0.65*infectionsByRequestedTime_severe;
	dollarsInFlight_severe=dollarsInFlight_severe*data.region.avgDailyIncomeInUSD;
	dollarsInFlight_severe=Math.floor(dollarsInFlight_severe/data.timeToElapse);

	var data=data;
	var impact={
		"currentlyInfected":currentlyInfected,
		"infectionsByRequestedTime":infectionsByRequestedTime,
		"severeCasesByRequestedTime":severeCasesByRequestedTime,
		"hospitalBedsByRequestedTime":hospitalBedsByRequestedTime,
		"casesForICUByRequestedTime":casesForICUByRequestedTime,
		"casesForVentilatorsByRequestedTime":casesForVentilatorsByRequestedTime,
		"dollarsInFlight":dollarsInFlight

	};
	var severeImpact={
		"currentlyInfected":severeImpactCurrentlyInfected,
		"infectionsByRequestedTime":infectionsByRequestedTime_severe,
		"severeCasesByRequestedTime":severeCasesByRequestedTime_severe,
		"hospitalBedsByRequestedTime":hospitalBedsByRequestedTime_severe,
		"casesForICUByRequestedTime":casesForICUByRequestedTime_severe,
		"casesForVentilatorsByRequestedTime":casesForVentilatorsByRequestedTime_severe,
		"dollarsInFlight":dollarsInFlight_severe
	};
	console.log("\n Data used : ");
	console.log(data);
	console.log("\n Possible impact estimation : ");
	console.log(impact);
	console.log("\n Severe Impact estimation : ");
	console.log(severeImpact);
	return covid19ImpactEstimator;
}


collectData =()=>
{
	console.log("\nStarting COVID-19 estimator....\n");
	readline.question(`Country/continent name ?\n`, (regionName) => {
  readline.question(`Average Age ?\n`, (avAge) => {
  readline.question(`Average income(in dollars) ?\n`, (avIncome) => {
  readline.question(`Average Daily Income Population(in dollars) ?\n`, (AvDailyIncomePopulation) => {
  readline.question(`Enter Period type (days, weeks , months) ?\n`, (type) => {
  readline.question(`Time To Elapse ?\n`, (days) => {
  readline.question(`Reported cases ?\n`, (repCases) => {
  readline.question(`Total population ?\n`, (populationz) => {
  readline.question(`Total hopital beds ?\n`, (totalBeds) => {

  	switch (type) 
	{
  case "days":
	
	a=days;
    break;
  case "weeks":
  	//There would always be 7 days in a week.
  	a=days*7;

    break;
  case "months":
  	//from description, assume that there would always be 30 days in a month.
  	a=days*30;
    break;
}

  data={
region: {
name: regionName,
avgAge: Math.floor(avAge),
avgDailyIncomeInUSD: Math.floor(avIncome),
avgDailyIncomePopulation: Math.floor(AvDailyIncomePopulation)
},
periodType: type,
timeToElapse: a,
reportedCases: Math.floor(repCases),
population: Math.floor(populationz),
totalHospitalBeds: Math.floor(totalBeds)
};
//console.log(data);

  readline.close();
  startServer();

  /*covid19ImpactEstimator(data);*/


});
});
  
});
  
});
  
});
  
});
  
});
  
});

});

}

startServer =()=>
{
var ms=0;
var x=JSON.stringify(data);
app.post('/api/v1/on-covid-19', function (req, res) {
  res.send(x);
  console.log(x);
});

covid19ImpactEstimator(data);



app.get("/api/v1/on-covid-19", (req, res, next) => {
 res.json(data);
 
 var start = new Date();
 ms=new Date() - start + ' ms';
 //console.log(data);
 console.log('Request took:', ms);
 var xx="\nGet\t /api/v1/on-covid-19/logs \t200\t"+ms+"\t";
 fs.appendFileSync('log.json', xx);
 console.log('Request took:', ms);
 
});

app.get("/api/v1/on-covid-19/logs", (req, res, next) => {
 res.json(data);
 
 var start = new Date();
 ms=new Date() - start + ' ms';
 //console.log(data);
 var xx="\nGet\t /api/v1/on-covid-19/logs \t200\t"+ms+"\t";
 fs.appendFileSync('log.json', xx);
 console.log('Request took:', ms);
 
});

app.get("/api/v1/on-covid-19/xml", (req, res, next) => {
 res.json(data);
 
 var start = new Date();
 ms=new Date() - start + ' ms';
 //console.log(data);
 var xx="\nGet\t /api/v1/on-covid-19/xml \t200\t"+ms+"\t";
 fs.appendFileSync('log.xml', xx);
 console.log('Request took:', ms);
 
});

app.listen(8080, () => {
 console.log("Server running on port 8080");
});

}
collectData();
exports = covid19ImpactEstimator;

//return covid19ImpactEstimator(data);





