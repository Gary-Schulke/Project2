var jsonLoc = "/Project2/static/data/monthly_rider_data.json";

var allDates = [];
var allMonths = [];
var allYears = [2017, 2018, 2019];
var allBus = [];
var allMax = [];
var allWes = [];
var selectedMonthYear = [];
var selectedMonthBus = [];
var selectedMonthMax = [];
var selectedMonthWes = [];

function getInitialData() {
    d3.json(jsonLoc).then(function (d) {
        for (var i = 0; i < d.data.length; i++) {
            allDates.push(d.data[i].date);
            allMonths.push(d.data[i].month);
            allBus.push(d.data[i].bus);
            allMax.push(d.data[i].max);
            allWes.push(d.data[i].wes);
            if (d.data[i].month === "Jan") {
                selectedMonthYear.push(d.data[i].year);
                selectedMonthBus.push(d.data[i].bus);
                selectedMonthMax.push(d.data[i].max);
                selectedMonthWes.push(d.data[i].wes);
            };
        };

        //Add Months to dropdown menu
        var dropDownMonths = allMonths.slice(0,12).forEach(d => d3.select("#selDataset1").append("option").attr("value", d).text(d));
        
        //Add Years to dropdown menu
        var dropDownYears = allYears.forEach(d => d3.select("#selDataset2").append("option").attr("value", d).text(d));

        var busBarTrace = {
            x: selectedMonthYear,
            y: selectedMonthBus,
            name: 'Bus',
            type: 'bar'
        };

        var busBarData = [busBarTrace];

        var busBarLayout = { title: 'Monthly Bus Riders' };

        Plotly.newPlot('bar-bus', busBarData, busBarLayout);

        var maxBarTrace = {
            x: selectedMonthYear,
            y: selectedMonthMax,
            name: 'MAX',
            type: 'bar'
        };

        var maxBarData = [maxBarTrace];

        var maxBarLayout = { title: 'Monthly MAX Riders' };

        Plotly.newPlot('bar-max', maxBarData, maxBarLayout);

        var wesBarTrace = {
            x: selectedMonthYear,
            y: selectedMonthWes,
            name: 'WES',
            type: 'bar'
        };

        var wesBarData = [wesBarTrace];

        var wesBarLayout = { title: 'Monthly WES Riders' };

        Plotly.newPlot('bar-wes', wesBarData, wesBarLayout);

        var traceBusLine = {
            x: allDates,
            y: allBus,
            name: 'Bus',
            type: 'scatter'
        };

        var traceMaxLine = {
            x: allDates,
            y: allMax,
            name: 'MAX',
            type: 'scatter'
        };

        var traceWesLine = {
            x: allDates,
            y: allWes,
            name: 'WES',
            type: 'scatter'
        };

        var allTimeData = [traceBusLine, traceMaxLine, traceWesLine];

        Plotly.newPlot('line', allTimeData);
    });
};

getInitialData();

console.log(selectedMonthYear);
console.log(selectedMonthBus);
console.log(selectedMonthMax);
console.log(selectedMonthWes);

