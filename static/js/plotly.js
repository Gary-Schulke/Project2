//Capture file path for JSON file
var jsonLoc = "/Project2/static/data/monthly_rider_data.json";

//Create function for pulling the data and pushing it into the charts
function getInitialData() {

    //Declare variables of the function that need to live outside of the for loop
    // var allDates = [];
    var allMonths = [];
    var allYears = [2017, 2018, 2019];
    // var allBus = [];
    // var allMax = [];
    // var allWes = [];
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


    //Read JSON file, then push all data needed into above variables
    d3.json(jsonLoc).then(function (d) {
        for (var i = 0; i < d.data.length; i++) {
            // allDates.push(d.data[i].date);
            allMonths.push(d.data[i].month);
            // allBus.push(d.data[i].bus);
            // allMax.push(d.data[i].max);
            // allWes.push(d.data[i].wes);
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

        //Add Months to dropdown menu
        var dropDownMonths = allMonths.slice(0, 12).forEach(d => d3.select("#selDataset1").append("option").attr("value", d).text(d));

        //Add Years to dropdown menu
        var dropDownYears = allYears.forEach(d => d3.select("#selDataset2").append("option").attr("value", d).text(d));

        //Define the coordinates for the bus chart and identify the chart type as bar
        var busBarTrace = {
            x: selectedMonthYear,
            y: selectedMonthBus,
            name: 'Bus',
            type: 'bar'
        };

        //Store the trace for the bus bar chart
        var busBarData = [busBarTrace];
        
        //Add layout properties for the bus bar chart
        var busBarLayout = { title: 'Monthly Bus Riders' };

        //Create the bus bar chart
        Plotly.newPlot('bar-bus', busBarData, busBarLayout);

        //Define the coordinates for the MAX chart and identify the chart type as bar
        var maxBarTrace = {
            x: selectedMonthYear,
            y: selectedMonthMax,
            name: 'MAX',
            type: 'bar'
        };

        //Store the trace for the MAX bar chart
        var maxBarData = [maxBarTrace];

        //Add layout properties for the MAX bar chart
        var maxBarLayout = { title: 'Monthly MAX Riders' };

        //Create the MAX bar chart
        Plotly.newPlot('bar-max', maxBarData, maxBarLayout);

        //Define the coordinates for the WES chart and identify the chart type as bar
        var wesBarTrace = {
            x: selectedMonthYear,
            y: selectedMonthWes,
            name: 'WES',
            type: 'bar'
        };

        //Store the trace for the WES bar chart
        var wesBarData = [wesBarTrace];

        //Add layout properties for the WES bar chart
        var wesBarLayout = { title: 'Monthly WES Riders' };

        //Create the WES bar chart
        Plotly.newPlot('bar-wes', wesBarData, wesBarLayout);

        //Define the coordinates for the yearly line chart and identify the chart type as line
        //Create the bus trace
        var traceBusLine = {
            x: selectedYearDates,
            y: selectedYearBus,
            name: 'Bus',
            type: 'scatter',
            marker: {
                color: '#008cba',
                size: 10,
                // line: {
                //   color: '#008cba',
                //   width: 2
                // }
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
                size: 10,
                // symbol: ["diamond"],
                // line: {
                //   color: '#20c997',
                //   width: 2
                // }
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
                size: 10,
                // symbol: ["square"],
                // line: {
                //   color: '#43ac6a',
                //   width: 2
                // }
            }
        };

        var lineLayout = {
            legend: {
                x: 1,
                xanchor: 'right',
                y: 1
            },
          };

        //Store all traces for the yearly line chart
        var yearlyData = [traceBusLine, traceMaxLine, traceWesLine];

        //Create the yearly line chart
        Plotly.newPlot('line', yearlyData, lineLayout);
    });
    console.log(selectedYearDates);
};
getInitialData();