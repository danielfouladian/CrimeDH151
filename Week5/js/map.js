// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 1;
let globaldata;

let geojsonPath = 'data/nyc-boroughs.json';
let geojson_data;
let geojson_layer;
let brew = new classyBrew();
let legend = L.control({position: 'bottomright'});
let info_panel = L.control();

// path to csv data

let path = "data/arrest.csv";

let aapimarkers = L.featureGroup();
let amindmarkers = L.featureGroup();
let blackmarkers = L.featureGroup();
let blackhispanicmarkers = L.featureGroup();
let unknownmarkers = L.featureGroup();
let whitemarkers = L.featureGroup();
let whitehispanicmarkers = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	getGeoJSON();
	readCSV(path);
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

function flyToIndex(lat, lon){
	map.flyTo([lat,lon],12)
};

// function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			globaldata = data;
			aapi = globaldata.data.filter(data => data.PERP_RACE=='ASIAN / PACIFIC ISLANDER');
			amind = globaldata.data.filter(data => data.PERP_RACE=='AMERICAN INDIAN/ALASKAN NATIVE');
			black = globaldata.data.filter(data => data.PERP_RACE=='BLACK');
			blackhispanic = globaldata.data.filter(data => data.PERP_RACE=='BLACK HISPANIC');
			unknown = globaldata.data.filter(data => data.PERP_RACE=='UNKNOWN');
			white = globaldata.data.filter(data => data.PERP_RACE=='WHITE');
			whitehispanic = globaldata.data.filter(data => data.PERP_RACE=='WHITE HISPANIC');
			// map the data
			
			mapCSV(aapi, aapimarkers, '#F5D0CC', 'Asian/Pacific Islanders');
			mapCSV(amind, amindmarkers, '#ECA299', 'American Indian/Alaskan Native');
			mapCSV(black, blackmarkers, '#E27367', 'Black');
			mapCSV(blackhispanic, blackhispanicmarkers, '#D94534', 'Black Hispanic');
			mapCSV(unknown, unknownmarkers, '#BF2B1A', 'Unknown');
			mapCSV(white, whitemarkers, '#AF4034', 'White');
			mapCSV(whitehispanic, whitehispanicmarkers, '#680B01', 'White Hispanic');

			let layers = {
				"Asian/Pacific Islanders": aapimarkers,
				"American Indian/Alaskan Native": amindmarkers,
				"Black": blackmarkers,
				"Black Hispanic": blackhispanicmarkers,
				"White": whitemarkers,
				"White Hispanic": whitehispanicmarkers,
				"Unknown": unknownmarkers,
				
			};

			L.control.layers(null, layers).addTo(map)

		}
	});
}

function mapCSV(data, featuregroup, color, name){
	
	// circle options
	let circleOptions = {
		radius: 5,
		weight: 1,
		color: 'white',
		fillColor: color,
		fillOpacity: 1
	}

	// loop through each entry
	data.forEach(function(item,index){
		// create marker
		let marker = L.circleMarker([item.latitude,item.longitude],circleOptions)
		.on('mouseover', function(){
			this.bindPopup(`<h3>${item.date}</h3><p><strong> Arrest Details: </strong>${item.desc}</p><p><strong>`).openPopup()
		})

		// add marker to featuregroup		
		featuregroup.addLayer(marker)
	})

	// add featuregroup to map
	featuregroup.addTo(map)

	// fit markers to map
	map.fitBounds(featuregroup.getBounds())
}

// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON('asian') // add a field to be used
	})
}

function mapGeoJSON(field){

	// clear layers in case it has been mapped already
	if (geojson_layer){
		geojson_layer.clearLayers()
	}
	
	// globalize the field to map
	fieldtomap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function(item,index){
		values.push(item.properties[field])
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(5);
	brew.setColorCode('YlOrRd');
	brew.classify('equal_interval');

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data, {
		style: getStyle, //call a function to style each feature
		onEachFeature: onEachFeature // actions on each feature
	}).addTo(map);

	map.fitBounds(geojson_layer.getBounds());

	createLegend();

	createInfoPanel();
}

function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
		fillOpacity: 0.8
	}
}

function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
					'<i style="background:' + brew.getColorInRange(from) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 2,
		color: '#666',
		fillOpacity: 0.7
	});

	// if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	// 	layer.bringToFront();
	// }

	info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);
	info_panel.update() // resets infopanel
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function createInfoPanel(){

	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a borough';
		}
	};

	info_panel.addTo(map);
}