const express = require('express');
const fs = require('fs');
const app = express();
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
})
/*data={
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
};*/


get_power= (x)=>
{
	for (i= 1; i <= x; ++i)
    {
       power_result=x*2;
       //console.log(power_result)
    }
    //return power_result
}
const covid19ImpactEstimator = (data) =>
{	
	const power= 1;
	const power_result=1;
	const currentlyInfected= data.reportedCases * 10;
	const severeImpactCurrentlyInfected= data.reportedCases * 50;
	// demo day for testing is 58 as ref in the data json object, this can be changed later. 
	const inputDays= data.timeToElapse;
	const sample= Math.floor(inputDays / 3);
	//convert to whole number
	get_power(sample);
    //console.log(power);
	const infectionsByRequestedTime= Math.floor(currentlyInfected * power_result);
	const infectionsByRequestedTime_severe= Math.floor(severeImpactCurrentlyInfected * power_result);
	//15% is also 
	const severeCasesByRequestedTime= Math.floor(0.15 * infectionsByRequestedTime);
	const severeCasesByRequestedTime_severe= Math.floor(0.15 * infectionsByRequestedTime_severe);

	//Free beds space impact/ severe
	//according to data 35% of beds are extimated to be free 35% = 0.35;
	const freeBeds= Math.floor(0.35 * data.totalHospitalBeds);
	const hospitalBedsByRequestedTime= freeBeds-severeCasesByRequestedTime;
	const hospitalBedsByRequestedTime_severe= freeBeds-severeCasesByRequestedTime_severe;
	//ICU
	const casesForICUByRequestedTime= Math.floor(0.05 * infectionsByRequestedTime);
	const casesForICUByRequestedTime_severe= Math.floor(0.05 * infectionsByRequestedTime_severe);
	//vent
	const casesForVentilatorsByRequestedTime= Math.floor(0.02 * infectionsByRequestedTime);
	const casesForVentilatorsByRequestedTime_severe= Math.floor(0.02 * infectionsByRequestedTime_severe);
	//dollarsInFlight
	//65% of the region (the majority) earn average pay from data
	const dollarsInFlight= Math.floor((0.65 * infectionsByRequestedTime * data.region.avgDailyIncomeInUSD) / data.timeToElapse);

	//dollarsInFlight= Math.floor(dollarsInFlight);

	const dollarsInFlight_severe= Math.floor((0.65 * infectionsByRequestedTime_severe * data.region.avgDailyIncomeInUSD) / data.timeToElapse);
	

	//const data= data;
	const impact= {
		'currentlyInfected':currentlyInfected,
		'infectionsByRequestedTime':infectionsByRequestedTime,
		'severeCasesByRequestedTime':severeCasesByRequestedTime,
		'hospitalBedsByRequestedTime':hospitalBedsByRequestedTime,
		'casesForICUByRequestedTime':casesForICUByRequestedTime,
		'casesForVentilatorsByRequestedTime':casesForVentilatorsByRequestedTime,
		'dollarsInFlight':dollarsInFlight

	};
	const severeImpact= {
		'currentlyInfected':severeImpactCurrentlyInfected,
		'infectionsByRequestedTime':infectionsByRequestedTime_severe,
		'severeCasesByRequestedTime':severeCasesByRequestedTime_severe,
		'hospitalBedsByRequestedTime':hospitalBedsByRequestedTime_severe,
		'casesForICUByRequestedTime':casesForICUByRequestedTime_severe,
		'casesForVentilatorsByRequestedTime':casesForVentilatorsByRequestedTime_severe,
		'dollarsInFlight':dollarsInFlight_severe
	};
	console.log('\n Data used : ');
	console.log(data);
	console.log('\n Possible impact estimation : ');
	console.log(impact);
	console.log('\n Severe Impact estimation : ');
	console.log(severeImpact);
	startServer(data);
}


collectData = () =>
{
	console.log('\nStarting COVID-19 estimator....\n');
	var a="days";
	readline.question('Country/continent name ?\n', (regionName)=> {
 readline.question('Average Age ?\n', (avAge)=> {
 readline.question('Average income(in dollars) ?\n', (avIncome)=> {
 readline.question('Average Daily Income Population(in dollars) ?\n', (AvDailyIncomePopulation) => {
 readline.question('Enter Period type (days, weeks , months) ?\n', (type)=> {
 readline.question('Time To Elapse ?\n', (days)=> {
 readline.question('Reported cases ?\n', (repCases)=> {
 readline.question('Total population ?\n', (populationz)=> {
 readline.question('Total hopital beds ?\n', (totalBeds)=> {

 	switch (type) 
	{
 case 'days':
	
	a= days;
  break;
 case 'weeks':
 	//There would always be 7 days in a week.
 	a= days * 7;

  break;
 case 'months':
 	//from description, assume that there would always be 30 days in a month.
 	a= days * 30;
  break;
}

 const data= {
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
 covid19ImpactEstimator(data);

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

startServer = (data) =>
{

const x= JSON.stringify(data);
app.post('/api/v1/on-covid-19', function (req, res) {
 res.send(x);
 console.log(x);
});

//covid19ImpactEstimator(data);



app.get('/api/v1/on-covid-19', (req, res, next)=> {
 res.json(data);
 
 const start = new Date();
 ms= new Date() - start + ' ms';
 //console.log(data);
 console.log('Request took:', ms);
 const x1= '\nGet\t\t /api/v1/on-covid-19/logs \t\t200\t\t'+ms+'\t\t';
 fs.appendFileSync('log.json', x1);
 console.log('Request took:', ms);
 
});

app.get('/api/v1/on-covid-19/logs', (req, res, next)=> {
 res.json(data);
 
 const start2 = new Date();
 ms= new Date() - start2 + ' ms';
 //console.log(data);
 const x2= '\nGet\t\t /api/v1/on-covid-19/logs \t\t200\t\t'+ms+'\t\t';
 fs.appendFileSync('log.json', x2);
 console.log('Request took:', ms);
 
});

app.get('/api/v1/on-covid-19/xml', (req, res, next)=> {
 res.json(data);
 
 const start3 = new Date();
 ms= new Date() - start3 + ' ms';
 //console.log(data);
 const x3= '\nGet\t\t /api/v1/on-covid-19/xml \t\t200\t\t'+ms+'\t\t';
 fs.appendFileSync('log.xml', x3);
 console.log('Request took:', ms);
 
});

app.listen(8080, ()=> {
 console.log('Server running on port 8080');
});

}


collectData();
exports= covid19ImpactEstimator;

//return covid19ImpactEstimator(data);





