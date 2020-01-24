/* Bootcamp Project 2
   Team Scrape & Show: Gary Schulke, Tabor Webb, Lindsey McKenna
   Date: January 23, 2019
   Note: For local operation run the Python local file server. "python3 -m http.server"
*/

//  Constants
const URLS2018 = `./static/data/route_ridership_report_sorted_by_route_weekdaySpring2018.json`;
const URLF2018 = `./static/data/route_ridership_report_sorted_by_route_weekdayFall2018.json`;
const URLS2019 = `./static/data/route_ridership_report_sorted_by_route_weekdaySpring2019.json`;
const URLF2019 = `./static/data/route_ridership_report_sorted_by_route_weekdayFall2019.json`;
const DIVTAG = 'scatter2';
const PULLDOWNID = '#selDataset3'
const S2018 = 0, F2018 = 1, S2019 = 2, F2019 = 3;
const LBLS = {'0': 'Spring 2018', '1': 'Fall 2018', '2': 'Spring 2019', '3': 'Fall 2019'};

// Variables
const defaultTraceSelection = S2018;
var traceList = [];
var routeDataList = [];

// Read all the .json files and initiates creation of the page.
function readData() {
  let route_data = null;
  d3.json(URLS2018).then(function (jFile) {
    route_data = removeCommas(jFile.data);
    routeDataList.push(route_data);
    d3.json(URLF2018).then(function (jFile) {
      route_data = removeCommas(jFile.data);
      routeDataList.push(route_data);
      d3.json(URLS2019).then(function (jFile) {
        route_data = removeCommas(jFile.data);
        routeDataList.push(route_data);
        d3.json(URLF2019).then(function (jFile) {
          route_data = removeCommas(jFile.data);
          routeDataList.push(route_data);
          initializeIDPulldown();
          buildBarChart(0);
        });
      });
    });
  });
};    // End readData()

// The event handler for the Test Subject ID pulldown menu.
function periodChanged(optionValue) {
  const id_idx = parseInt(optionValue);
  updateScatterPlot(id_idx);
};

// Gets all the Subject Ids and assigns the index.
// The .json file is sorted the same for namd, samples and metadata fields.
function initializeIDPulldown() {
  let selPeriod = d3.select(PULLDOWNID);
  let option;
  
  option = selPeriod.append("option");
  option.property("text", "Spring 2018");
  option.property("value", S2018);

  option = selPeriod.append("option");
  option.property("text", "Fall 2018");
  option.property("value", F2018);

  option = selPeriod.append("option");
  option.property("text", "Spring 2019");
  option.property("value", S2019);

  option = selPeriod.append("option");
  option.property("text", "Fall 2019");
  option.property("value", F2019);
};


// Construct the Bar Chart
// subID - the index value pulled from the pulldown selector.
function buildBarChart() {

  let boardingRidesList = [];
  let costPerRideList = [];
  let routeNumber = [];

  // Separate the data for each period into a list.
  routeDataList.forEach(sample => {
    let brl = [];
    let cpr = [];
    let rtn = [];
    sample.forEach(each => {

      brl.push(each.boarding_rides);
      cpr.push(each.cost_per_ride);
      rtn.push("Route: " + each.route_number + "<br>" + each.route_name);
    });
    boardingRidesList.push(brl);
    costPerRideList.push(cpr);
    routeNumber.push(rtn);
  });

  // Create a Plotly trace for each set of data.
  var traceS2018 = {
    x: costPerRideList[S2018],
    y: boardingRidesList[S2018],
    mode: 'markers',
    type: 'scatter',
    name: 'Spring 2018',
    text: routeNumber[S2018],
    marker: { size: 8 },
    opacity: 1
  };

  let traceF2018 = {
    x: costPerRideList[F2018],
    y: boardingRidesList[F2018],
    mode: 'markers',
    type: 'scatter',
    name: 'Fall 2018',
    text: routeNumber[F2018],
    marker: { size: 8 },
    opacity: 1
  };
  let traceS2019 = {
    x: costPerRideList[S2019],
    y: boardingRidesList[S2019],
    mode: 'markers',
    type: 'scatter',
    name: 'Spring 2019',
    text: routeNumber[S2019],
    marker: { size: 8 },
    opacity: 1
  };

  let traceF2019 = {
    x: costPerRideList[F2019],
    y: boardingRidesList[F2019],
    mode: 'markers',
    type: 'scatter',
    name: 'Fall 2019',
    text: routeNumber[F2019],
    marker: { size: 8 },
    opacity: 1
  };

  let aT = createAccentTrace(S2018);
  let mT = createMedianTrace(S2018);
  traceList.push([traceS2018, aT, mT]);

  aT = createAccentTrace(F2018);
  mT = createMedianTrace(F2018);
  traceList.push([traceF2018, aT, mT]);

  aT = createAccentTrace(S2019);
  mT = createMedianTrace(S2019);
  traceList.push([traceS2019, aT, mT]);

  aT = createAccentTrace(F2019);
  mT = createMedianTrace(F2019);
  traceList.push([traceF2019, aT, mT]);

  let heading = getVariableHeading(defaultTraceSelection);
  let layout = generateLayout(heading);

  Plotly.react(DIVTAG, traceList[defaultTraceSelection], layout);

};

// This function is called by the event handler when the 
// period selection has been changed.
// showPeriod (int) - value of one of the defined constants (0-3)
function updateScatterPlot(showPeriod) {
  let label = getVariableHeading(showPeriod);
  let lo = generateLayout(label);
  let traces = traceList[showPeriod];
  Plotly.react(DIVTAG, traces, lo);
};

// Utility function to get the defined chart text for the selection.
// showPeriod (int) - value of one of the defined constants (0-3)
// returns (String) - the text on the second line of the chart heading.
function getVariableHeading(showPeriod) {
  let key = showPeriod.toString();

  return LBLS[showPeriod];
}

// Generalize function to create the layout.
// Some layout features change when the period is changed.
// label (String) - Text displayed on the second line of the chart title.
// returns a Plotly layout dictionary.
function generateLayout(label) {
  let lay = {
    title: { text: `Cost vs Rides<br>${label}`, font: { size: 24 } },
    xaxis: {
      title: { text: `Cost per Ride `, font: { size: 24 } },
      tickprefix: '$',
      color: 'black'
    },
    yaxis: { title: { text: `Boarding Rides`, font: { size: 24 } } },
    margin: { l: 100, r: 100, t: 100, b: 100 },
    showlegend: true
  };
  return lay;
};

// Creates the trace showing the worst and best route based on cost per ride.
// showPeriod (int) - one of the constants defined above 0 - 3.
// returns a Plotly trace dictionary.
function createAccentTrace(showPeriod) {
  // Get the minimum and maximum entries based on cost per ride.
  // This trace will display as a different color. Probably orange.
  let maxCost = routeDataList[showPeriod].reduce(function (max, d) {
    return (d.cost_per_ride > max.cost_per_ride) ? d : max;
  }, routeDataList[showPeriod][0]);
  let minCost = routeDataList[showPeriod].reduce(function (min, d) {
    return (d.cost_per_ride < min.cost_per_ride) ? d : min;
  }, routeDataList[showPeriod][0]);

  // Assemble the trace data and labels
  let traceXData = [minCost.cost_per_ride, maxCost.cost_per_ride];
  let traceYData = [minCost.boarding_rides, maxCost.boarding_rides];
  let xAxisFlyoverList = [
    "Route " + minCost.route_number,
    "Route " + maxCost.route_number];

  let accentTrace = {
    x: traceXData,
    y: traceYData,
    mode: 'markers',
    type: 'scatter',
    name: 'Highest/Lowest',
    text: xAxisFlyoverList,
    marker: { size: 10 },
  };
  return accentTrace;
};
// tickvals, ticktext
// Creates the trace showing median of cost and ride.
// showPeriod (int) - one of the constants defined above 0 - 3.
// returns a Plotly trace dictionary.
function createMedianTrace(showPeriod) {
  // Get the minimum and maximum entries based on cost per ride.
  // This trace will display as a different color. Probably green.
  let costLst = routeDataList[showPeriod].map(each => each.cost_per_ride);
  let rideLst = routeDataList[showPeriod].map(each => each.boarding_rides);
  let medCost = d3.median(costLst);
  let medRide = d3.median(rideLst)

  // Assemble the trace data and labels
  let traceXData = [medCost];
  let traceYData = [medRide];
  let xAxisFlyoverList = [
    "Median Cost " + medCost + "<br>" + "Median Ride " + medRide];

  let accentTrace = {
    x: traceXData,
    y: traceYData,
    mode: 'markers',
    type: 'scatter',
    name: 'Median',
    text: xAxisFlyoverList,
    marker: { size: 12 }
  };
  return accentTrace;
};
// Removes comma from numerical strings.
// data - the json array
// returns - the json array with commas removed and converted to int or float.
function removeCommas(data) {
  let aRoute = data;
  data.forEach(each => {
    each.boarding_rides = parseInt(each.boarding_rides.replace(",", ""));
    each.cost_per_ride = parseFloat(each.cost_per_ride.replace(",", ""));
  });
  return aRoute;
};

// Start program execution.
readData();
