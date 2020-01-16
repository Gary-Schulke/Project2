// Set Data Source URLs


// Create the Tile Layer That Will Be the Base Layer of the Map
var streetsMap = L.tileLayer(MAPY, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});

// Create Layer Groups

// Create BaseMaps Object to Hold Base (Tile) Layers
var baseMaps = {
    
};

// Create OverlayMaps Object to Hold Overlay (LayerGroup) Layers
var overlayMaps = {
    
};

// Create Map & Pass in SatelliteMap & Earthquakes Layer as Default Layers
var myMap = L.map("map", {
    center: [45.523068, -122.667674],
    zoom: 12,
    layers: [streetsMap]
});

// Create a Layer Control & Pass in the BaseMaps & OverlayMaps & Add Layer Control to Map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);