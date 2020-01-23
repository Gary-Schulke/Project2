// Set Data Source URLs
var tmBoundaryURL = "static/data/tm_boundary.json";
var neighborhoodBoundariesURL = "static/data/neighborhoods.geojson";
var tmRailBusRoutesURL = "static/data/tm_routes.json";
var tmRailBusStopsURL = "static/data/tm_stops.json";
var tmTransitCentersURL = "static/data/tm_tran_cen.json";
var tmParkRideURL = "static/data/tm_parkride.json";

// Mapbox API Key For Maki Markers
L.MakiMarkers.accessToken = API_KEY;

// Create the Tile Layers That Will Be the Base Layers of the Map
var streetsMap = L.tileLayer(MAPY, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var satelliteStreetsMap = L.tileLayer(MAPY, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
});

// Create Layer Groups That Will Be the Overlay Layers of the Map
var trimetBoundary = new L.LayerGroup();
var neighborhhodBoundaries = new L.LayerGroup();
var trimetRailBusRoutes = new L.LayerGroup();
var trimetRailBusStops = new L.markerClusterGroup();
var trimetTransitCenters = new L.LayerGroup();
var trimetParkRide = new L.LayerGroup();

// Create BaseMaps Object to Hold Base (Tile) Layers
var baseMaps = {
    "Street Map": streetsMap,
    "Satellite Map": satelliteStreetsMap
};

// Create OverlayMaps Object to Hold Overlay (Layer Group) Layers
var overlayMaps = {
    "Trimet Boundary": trimetBoundary,
    "Neighborhood Boundaries": neighborhhodBoundaries,
    "Rail/Bus/Tram Routes": trimetRailBusRoutes,
    "Rail/Bus/Tram Stops": trimetRailBusStops,
    "Transit Centers": trimetTransitCenters,
    "Park & Ride": trimetParkRide
};

// Create Map & Add Streets Map as Default Base Layer
var myMap = L.map("map", {
    center: [45.46, -122.667674],
    zoom: 11,
    layers: [streetsMap]
});

// Create a Layer Control & Add the BaseMaps & OverlayMaps & Add Layer Control to Map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Create a Trimet Boundary Layer
d3.json(tmBoundaryURL, function (tmBoundaryData) {

    // Create a GeoJSON Layer
    L.geoJSON(tmBoundaryData, {

        fillColor: false,
        color: "#696969",
        weight: 4,
        fillOpacity: 0

    }).addTo(trimetBoundary);

    // Add Trimet Boundary Layer to Map
    trimetBoundary.addTo(myMap);

    // Create a Neighborhood Boundaries Layer
    d3.json(neighborhoodBoundariesURL, function (neighborhhodBoundariesData) {

        // Create a GeoJSON Layer
        L.geoJSON(neighborhhodBoundariesData, {

            fillColor: false,
            color: "#696969",
            weight: 4,
            fillOpacity: 0,

            // Binding a Pop-Up to Each Marker
            onEachFeature: function (feature, layer) {
                layer.bindPopup("<center><h6>" + feature.properties.MAPLABEL + "</h6></center>");
            }

        }).addTo(neighborhhodBoundaries);
    });

    // Create a Trimet Rail/Bus Routes Layer
    d3.json(tmRailBusRoutesURL, function (tmRailBusRoutesData) {

        // Function to Choose Route Color
        function chooseColor(route) {

            switch (true) {
                case route === "MAX":
                    return "#0000FF";
                case route === "CR":
                    return "#0000FF";
                case route === "SC":
                    return "#008000";
                case route === "AT":
                    return "#00BFFF";
                default:
                    return "#FF0000";
            }
        }

        // Function to Set Route Line Weight
        function chooseWeight(route) {

            switch (true) {
                case route === "MAX":
                    return 4;
                case route === "SC":
                    return 4;
                case route === "CR":
                    return 4;
                default:
                    return 3;
            }
        }

        // Function to Set Route Style
        function routeStyle(feature) {

            return {
                color: chooseColor(feature.properties.type),
                weight: chooseWeight(feature.properties.type),
                opacity: 0.75
            };
        }

        // Create a GeoJSON Layer
        L.geoJSON(tmRailBusRoutesData, {

            style: routeStyle,

        }).addTo(trimetRailBusRoutes);

        // Add Trimet Rail/Bus Routes Layer to Map
        trimetRailBusRoutes.addTo(myMap);
    });

    // Create a Trimet Rail/Bus Stops Layer
    d3.json(tmRailBusStopsURL, function (tmRailBusStopsData) {

        // Function to Choose Icon Color
        function chooseColor(type) {

            switch (true) {
                case type === "MAX":
                    return "#0000FF";
                case type === "CR":
                    return "#0000FF";
                case type === "SC":
                    return "#008000";
                case type === "AT":
                    return "#00BFFF";
                case type === "BSC":
                    return "#9ACD32";
                default:
                    return "#FF0000";
            }
        }

        // Function to Choose Icon Image
        function chooseIcon(type) {

            switch (true) {
                case type === "MAX":
                    return "rail";
                case type === "CR":
                    return "rail";
                case type === "SC":
                    return "rail-metro";
                case type === "AT":
                    return "aerialway";
                case type === "BSC":
                    return "rail-metro";
                default:
                    return "bus";
            }
        }

        // Create a GeoJSON Layer
        L.geoJSON(tmRailBusStopsData, {

            pointToLayer: function (feature, latlng) {

                busRailIcon = L.MakiMarkers.icon({ icon: chooseIcon(feature.properties.type), color: chooseColor(feature.properties.type), size: "m" });

                return L.marker(latlng, { icon: busRailIcon });
            },

            // Binding a Pop-Up to Each Marker
            onEachFeature: function (feature, layer) {
                layer.bindPopup("<center><h6>" + feature.properties.stop_name + "</h6></center>" +
                    "<center><p>City: " + feature.properties.jurisdiction + ", " + feature.properties.zipcode + "</p></center>" +
                    "<center><hr><p>Average Ridership by Quarter</p></center>" +
                    "<p>Spring 2018: " + feature.properties.spring2018 + "/day</p>" +
                    "<p>Fall 2018: " + feature.properties.fall2018 + "/day</p>" +
                    "<p>Spring 2019: " + feature.properties.spring2019 + "/day</p>" +
                    "<p>Fall 2019: " + feature.properties.fall2019 + "/day</p>");
            }

        }).addTo(trimetRailBusStops);

        // Add Trimet Rail/Bus Stops Layer to Map
        trimetRailBusStops.addTo(myMap);
    });

    // Create a Trimet Transit Centers Layer
    d3.json(tmTransitCentersURL, function (tmTransitCentersData) {

        transitCenterIcon = L.MakiMarkers.icon({ icon: "warehouse", color: "#4682B4", size: "m" });

        // Create a GeoJSON Layer
        L.geoJSON(tmTransitCentersData, {

            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: transitCenterIcon });
            },

            // Binding a Pop-Up to Each Marker
            onEachFeature: function (feature, layer) {
                layer.bindPopup("<center><h6>" + feature.properties.name + "</h6></center>" +
                    "<center><p>" + feature.properties.address + "</p></center>" +
                    "<hr><p>City: " + feature.properties.city + ", " + feature.properties.zipcode + "</p>" +
                    "<p>County: " + feature.properties.county + "</p>");
            }

        }).addTo(trimetTransitCenters);
    });

    // Create a Trimet Park & Ride Layer
    d3.json(tmParkRideURL, function (tmParkRideData) {

        parkingIcon = L.MakiMarkers.icon({ icon: "parking", color: "#708090", size: "m" });

        // Create a GeoJSON Layer
        L.geoJSON(tmParkRideData, {

            pointToLayer: function (feature, latlng) {

                return L.marker(latlng, { icon: parkingIcon });
            },

            // Binding a Pop-Up to Each Marker
            onEachFeature: function (feature, layer) {
                layer.bindPopup("<center><h6>" + feature.properties.name + "</h6></center>" +
                    "<center><p>" + feature.properties.address + "</p></center>" +
                    "<hr><p>City: " + feature.properties.city + ", " + feature.properties.zipcode + "</p>" +
                    "<p>County: " + feature.properties.county + "</p>" +
                    "<p>Parking Spaces: " + feature.properties.spaces + "</p>");
            }

        }).addTo(trimetParkRide);
    });

    // Create Legend & Add Inner HTML Div For Each Element/Layer on Map
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<img src="static/icons/blue_line.png">' + ' MAX/WES Lines' + '<br>'
        div.innerHTML += '<img src="static/icons/green_line.png">' + ' Streetcar Lines' + '<br>'
        div.innerHTML += '<img src="static/icons/red_line.png">' + ' Bus Routes' + '<br>'
        div.innerHTML += '<img src="static/icons/light_blue_line.png">' + ' Aerial Tram Line' + '<br>'
        div.innerHTML += '<img src="static/icons/max_stop.png">' + ' MAX/WES Stations' + '<br>'
        div.innerHTML += '<img src="static/icons/streetcar_stop.png">' + ' Streetcar Stops' + '<br>'
        div.innerHTML += '<img src="static/icons/bus_streetcar_stop.png">' + ' Bus/Streetcar Stops' + '<br>'
        div.innerHTML += '<img src="static/icons/tram_stop.png">' + ' Aerial Tram Stops' + '<br>'
        div.innerHTML += '<img src="static/icons/bus_stop.png">' + ' Bus Stops' + '<br>'
        div.innerHTML += '<img src="static/icons/transit_center.png">' + ' Transit Center' + '<br>'
        div.innerHTML += '<img src="static/icons/parking.png">' + ' Park & Ride'

        return div;
    };

    // Add Legend to Map
    legend.addTo(myMap);
});