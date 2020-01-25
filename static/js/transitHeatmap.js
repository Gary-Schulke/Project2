// Set Data Source URLs
var tmBoundaryURL = "static/data/tm_boundary.json";
var neighborhoodBoundariesURL = "static/data/neighborhoods.geojson";
var tmRailBusStopsURL = "static/data/tm_stops.json";

// Mapbox API Key For Maki Markers
L.MakiMarkers.accessToken = API_KEY;

// Create the Tile Layers That Will Be the Base Layers of the Map
var streetsMap = L.tileLayer(MAPY, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

// Create Layer Groups That Will Be the Overlay Layers of the Map
var trimetBoundary = new L.LayerGroup();
var neighborhhodBoundaries = new L.LayerGroup();
var trimetRailBusStops = new L.markerClusterGroup();

// Create BaseMaps Object to Hold Base (Tile) Layers
var baseMaps = {
    "Street Map": streetsMap
};

// Create OverlayMaps Object to Hold Overlay (Layer Group) Layers
var overlayMaps = {
    "Trimet Boundary": trimetBoundary,
    "Neighborhood Boundaries": neighborhhodBoundaries,
    "Rail/Bus/Tram Stops": trimetRailBusStops
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

        // Add Neighborhood Boundaries Layer to Map
        // neighborhhodBoundaries.addTo(myMap);
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

    // Create a HeatMap Layer
    d3.json(tmRailBusStopsURL, function (response) {

        var data = [];

        for (var i = 0; i < response.features.length; i++) {

            var feature = response.features[i];
            var totalRidership = parseInt(feature.properties.spring2018) + parseInt(feature.properties.fall2018) +
                parseInt(feature.properties.spring2019) + parseInt(feature.properties.fall2019);

            if (feature.properties.fall2019 > 0) {
                data.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0], totalRidership]);
            }
        }

        var heat = new L.heatLayer(data, {
            radius: 30,
            blur: 15,
            max: 250
        }).addTo(myMap);
    });

    // Create Legend & Add Inner HTML Div For Each Element/Layer on Map
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<img src="static/icons/max_stop.png">' + ' MAX/WES Stations' + '<br>'
        div.innerHTML += '<img src="static/icons/streetcar_stop.png">' + ' Streetcar Stops' + '<br>'
        div.innerHTML += '<img src="static/icons/bus_streetcar_stop.png">' + ' Bus/Streetcar Stops' + '<br>'
        div.innerHTML += '<img src="static/icons/tram_stop.png">' + ' Aerial Tram Stops' + '<br>'
        div.innerHTML += '<img src="static/icons/bus_stop.png">' + ' Bus Stops'

        return div;
    };

    // Add Legend to Map
    legend.addTo(myMap);
});