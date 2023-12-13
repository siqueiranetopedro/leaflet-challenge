// Define the API endpoint for earthquake data.
const queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch earthquake data with a GET request to the API.
d3.json(queryUrl).then(function(data) {
  // Process the response data by passing it to the createFeatures function.
  createFeatures(data.features);
});

// Function to create features from earthquake data.
function createFeatures(earthquakeData) {
  // Define a function to determine marker color based on depth.
  function getColor(depth) {
    if (depth < 10) {
      return "#ffffcc";
    } else if (depth < 20) {
      return "#a1dab4";
    } else if (depth < 30) {
      return "#41b6c4";
    } else if (depth < 70) {
      return "#2c7fb8";
    } else if (depth < 90) {
      return "#253494";
    } else {
      return "#081d58";
    }
  }

  // Define a function to run once for each feature in the features array.
  // Give each feature a popup describing the place, magnitude, and depth of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create a GeoJSON layer containing the features array from the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  const earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
      });
    },
    onEachFeature: onEachFeature
  });

  // Send the earthquakes layer to the createMap function.
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.
  const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object.
  const baseMaps = {
    "Street Map": street,
    //"Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  const overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  const myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
