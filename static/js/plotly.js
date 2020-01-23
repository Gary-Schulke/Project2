//Capture file path for JSON file
var jsonRider = '/static/data/monthly_rider_data.json';
var jsonWeather = '/static/data/final_weather_data.json';

//Declare variables of the function that need to live outside of the for loop
var allMonths = [];
var allDates = [];
var allYears = [2017, 2018, 2019];
var vehicle = "Bus"
var allVehicles = ["Bus", "MAX", "WES"]
var allRiders;
var allBus = [];
var allMax = [];
var allWes = [];
var allPrecip = [];
var selectedMonth = "Jan";
var selectedMonthYear = [];
var selectedMonthBus = [];
var selectedMonthMax = [];
var selectedMonthWes = [];
var selectedYear = 2017;
var selectedYearDates = [];
var selectedYearBus = [];
var selectedYearMax = [];
var selectedYearWes = [];
var selectedMonthTotPrecip = [];
var selectedYearTotPrecip = [];
var selectedMonthPrecipColors = [];

//Variables for color scale
var colorScale = ['#CCF5CE', '#AFEEBE', '#92E7B5', '#75DFB3', '#57D7B8', '#3ACEC3', '#1DB5C4', '#008CBA', '#00499F', '#001382']
var numericScale = ['0"-5"', '6"-10"', '11"-15"', '16"-20"', '21"-25"', '26"-30"', '31"-35"', '36"-40"', '41"-45"', '45"+']

//Function for identifying where the total precipitation falls on the color scale
function getColor(d) {
    return d > 45 ? colorScale[9] :
        d > 40 ? colorScale[8] :
            d > 35 ? colorScale[7] :
                d > 30 ? colorScale[6] :
                    d > 25 ? colorScale[5] :
                        d > 20 ? colorScale[4] :
                            d > 15 ? colorScale[3] :
                                d > 10 ? colorScale[2] :
                                    d > 5 ? colorScale[1] :
                                        colorScale[0]
};

//Add color scale
d3.select("#color-scale").selectAll('div')
    .data(colorScale)
    .enter()
    .append('div')
    .attr('class', '#color-block')
    .style('width', '38px')
    .style('height', '20px')
    .style('padding-left', '2px')
    .style('padding-top', '2px')
    .style('display', 'inline-block')
    .style('background-color', (d => d))

d3.select("#color-scale").selectAll('div')
    .data(numericScale)
    .text(d => d)
    .style('font-size', "10px")
    .style('color', '#fff')

//Create function for building the scatter plot
function buildScatterPlot() {
    var scatterTrace = {
        x: allPrecip,
        y: allRiders,
        mode: 'markers',
        name: `${vehicle} Ridership`,
        text: allDates,
        marker: {
            color: '#008cba',
            size: 12,
        },
        type: 'scatter'
    };

    var scatterData = [scatterTrace];

    var scatterLayout = {
        title: 'Ridership & Precipitation',
        xaxis: {
            title: 'Monthly Precipitation',
            showgrid: false,
            zeroline: false
        },
        yaxis: {
            title: 'Monthly Riders',
            showline: false
        }
    };

    Plotly.newPlot('scatter1', scatterData, scatterLayout);
};

//Create function for building the monthly charts
function buildMonthlyCharts() {
    //Define the coordinates for the bus chart and identify the chart type as bar
    var busBarTrace = {
        x: selectedMonthYear,
        y: selectedMonthBus,
        name: 'Bus',
        type: 'bar',
        marker: {
            color: selectedMonthPrecipColors
        }
    };

    //Store the trace for the bus bar chart
    var busBarData = [busBarTrace];

    //Add layout properties for the bus bar chart
    var busBarLayout = {
        title: 'Monthly Bus Riders',
        autosize: false,
        width: 350,
        height: 350
    };

    //Create the bus bar chart
    Plotly.newPlot('bar-bus', busBarData, busBarLayout);

    //Define the coordinates for the MAX chart and identify the chart type as bar
    var maxBarTrace = {
        x: selectedMonthYear,
        y: selectedMonthMax,
        name: 'MAX',
        type: 'bar',
        marker: {
            color: selectedMonthPrecipColors
        }
    };

    //Store the trace for the MAX bar chart
    var maxBarData = [maxBarTrace];

    //Add layout properties for the MAX bar chart
    var maxBarLayout = {
        title: 'Monthly MAX Riders',
        autosize: false,
        width: 350,
        height: 350
    };

    //Create the MAX bar chart
    Plotly.newPlot('bar-max', maxBarData, maxBarLayout);

    //Define the coordinates for the WES chart and identify the chart type as bar
    var wesBarTrace = {
        x: selectedMonthYear,
        y: selectedMonthWes,
        name: 'WES',
        type: 'bar',
        marker: {
            color: selectedMonthPrecipColors
        }
    };

    //Store the trace for the WES bar chart
    var wesBarData = [wesBarTrace];

    //Add layout properties for the WES bar chart
    var wesBarLayout = {
        title: 'Monthly WES Riders',
        autosize: false,
        width: 350,
        height: 350
    };

    //Create the WES bar chart
    Plotly.newPlot('bar-wes', wesBarData, wesBarLayout);
};

//Create function for building the annual chart
function buildYearlyChart() {
    //Define the coordinates for the yearly line chart and identify the chart type as line
    //Create the bus trace
    var traceBusLine = {
        x: selectedYearDates,
        y: selectedYearBus,
        name: 'Bus',
        type: 'scatter',
        marker: {
            color: '#008cba',
            size: selectedYearTotPrecip,
        }
    };

    //Create the MAX trace
    var traceMaxLine = {
        x: selectedYearDates,
        y: selectedYearMax,
        name: 'MAX',
        type: 'scatter',
        marker: {
            color: '#20c997',
            size: selectedYearTotPrecip,
        }
    };

    //Create the WES trace
    var traceWesLine = {
        x: selectedYearDates,
        y: selectedYearWes,
        name: 'WES',
        type: 'scatter',
        marker: {
            color: '#43ac6a',
            size: selectedYearTotPrecip,
        }
    };

    //Store all traces for the yearly line chart
    var yearlyData = [traceBusLine, traceMaxLine, traceWesLine];

    //Create the yearly line chart
    Plotly.newPlot('line', yearlyData);
};


//Create function for pulling the initial data and pushing it into the charts
function getInitialData() {

    //Read JSON file, then push all data needed into above variables
    d3.json(jsonWeather).then(function (d) {
        for (var i = 0; i < d.data.length; i++) {
            allPrecip.push(d.data[i].total_precip)

            if (d.data[i].month === selectedMonth) {
                selectedMonthTotPrecip.push(d.data[i].total_precip);
                selectedMonthPrecipColors.push(getColor(d.data[i].total_precip));
            };
            if (d.data[i].year === selectedYear) {
                selectedYearTotPrecip.push(d.data[i].total_precip);
            };
        };

        d3.json(jsonRider).then(function (d) {
            for (var i = 0; i < d.data.length; i++) {

                allMonths.push(d.data[i].month);
                allDates.push(d.data[i].date);
                allBus.push(d.data[i].bus);
                allMax.push(d.data[i].max);
                allWes.push(d.data[i].wes);

                if (d.data[i].month === selectedMonth) {
                    selectedMonthYear.push(d.data[i].year);
                    selectedMonthBus.push(d.data[i].bus);
                    selectedMonthMax.push(d.data[i].max);
                    selectedMonthWes.push(d.data[i].wes);
                };
                if (d.data[i].year === selectedYear) {
                    selectedYearDates.push(d.data[i].date);
                    selectedYearBus.push(d.data[i].bus);
                    selectedYearMax.push(d.data[i].max);
                    selectedYearWes.push(d.data[i].wes);
                };
            };

            allRiders = allBus;

            //Add Months to dropdown menu
            var dropDownVehicles = allVehicles.forEach(d => d3.select("#selDataset4").append("option").attr("value", d).text(d));

            //Add Months to dropdown menu
            var dropDownMonths = allMonths.slice(0, 12).forEach(d => d3.select("#selDataset1").append("option").attr("value", d).text(d));

            //Add Years to dropdown menu
            var dropDownYears = allYears.forEach(d => d3.select("#selDataset2").append("option").attr("value", d).text(d));

            //Call functions to build the charts
            buildMonthlyCharts();
            buildYearlyChart();
            buildScatterPlot();
        });
    });
};

//Call the initial data function to generate charts on page load
getInitialData();

//Handle the change for the month selection
function monthChanged() {
    var newMonth = document.getElementById("selDataset1").value;
    console.log(newMonth);
    //Create function for pulling the data and pushing it into the charts
    selectedMonthYear = [];
    selectedMonthBus = [];
    selectedMonthMax = [];
    selectedMonthWes = [];
    selectedMonthTotPrecip = [];
    selectedMonthPrecipColors = [];

    //Read JSON file, then push all data needed into above variables
    d3.json(jsonWeather).then(function (d) {

        for (var i = 0; i < d.data.length; i++) {
            if (d.data[i].month === newMonth) {
                selectedMonthTotPrecip.push(d.data[i].total_precip);
                selectedMonthPrecipColors.push(getColor(d.data[i].total_precip));
            };
        };

        d3.json(jsonRider).then(function (d) {
            for (var i = 0; i < d.data.length; i++) {
                if (d.data[i].month === newMonth) {
                    selectedMonthYear.push(d.data[i].year);
                    selectedMonthBus.push(d.data[i].bus);
                    selectedMonthMax.push(d.data[i].max);
                    selectedMonthWes.push(d.data[i].wes);
                };
            };
            buildMonthlyCharts();
        });
    });
};

//Handle the change for year selection
function yearChanged() {
    var newYear = document.getElementById("selDataset2").value;
    console.log(newYear);
    selectedYearDates = [];
    selectedYearBus = [];
    selectedYearMax = [];
    selectedYearWes = [];
    selectedYearTotPrecip = [];

    d3.json(jsonWeather).then(function (d) {

        for (var i = 0; i < d.data.length; i++) {
            if (d.data[i].year == newYear) {
                selectedYearTotPrecip.push(d.data[i].total_precip);
            };
        };

        d3.json(jsonRider).then(function (d) {
            for (var i = 0; i < d.data.length; i++) {
                if (d.data[i].year == newYear) {
                    selectedYearDates.push(d.data[i].date);
                    selectedYearBus.push(d.data[i].bus);
                    selectedYearMax.push(d.data[i].max);
                    selectedYearWes.push(d.data[i].wes);
                };
            };
            buildYearlyChart();
            console.log(selectedYearBus);
        });
    });
};

//Handle the change for year selection
function vehicleChanged() {
    vehicle = document.getElementById("selDataset4").value;
    console.log(vehicle)
    if (vehicle == "MAX") {
        allRiders = allMax;
    }
    else if (vehicle == "WES") {
        allRiders = allWes;
    }
    else {
        allRiders = allBus
    };
    buildScatterPlot();
};