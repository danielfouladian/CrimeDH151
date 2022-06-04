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
let blackmarkers = L.featureGroup();
let hispanicmarkers = L.featureGroup();
let whitemarkers = L.featureGroup();
let othermarkers = L.featureGroup();

let aapi;
let black;
let hispanic;
let white;
let other;

let protestmarkers = L.featureGroup();
let protest = [
	{
		'title':'Bay Ridge',
		'lat':'40.62591540112481',
		'lon':'-74.02721886169802',
		'url':'pictures/bayridge.jpg'
	},
	{
		'title':'Sunset Park',
		'lat':'40.64865259769964',
		'lon':'-74.0047435319297',
		'url':'pictures/sunsetpark.jpg'
	},
	{
		'title':'Flatbush',
		'lat':'40.64145544909182',
		'lon':'-73.95942472054867',
		'url':'pictures/flatbush.jpg'
	},
	{
		'title':'Rockaway',
		'lat':'40.58552430396091',
		'lon':'-73.8173381962468',
		'url':'pictures/rockaway.jpg'
	},
	{
		'title':'East New York',
		'lat':'40.660471050427816',
		'lon':'-73.87687528695704',
		'url':'pictures/eastny.jpg'
	},
	{
		'title':'Park Slope',
		'lat':'40.673609398697145',
		'lon':'-73.98141869547717',
		'url':'pictures/parkslope.jpg'
	},
	{
		'title':'Grand Army Plaza',
		'lat':'40.67443163158397',
		'lon':'-73.97032925016751',
		'url':'pictures/grandarmyplaza.jpg'
	},
	{
		'title':'Barclays Center',
		'lat':'40.68279292748874',
		'lon':'-73.97528685627431',
		'url':'pictures/barclays.jpg'
	},
	{
		'title':'Cadman Plaza',
		'lat':'40.698119657900286',
		'lon':'-73.99086860783727',
		'url':'pictures/cadmanplaza.jpg'
	},
	{
		'title':'88th Precinct',
		'lat':'40.69027946242756',
		'lon':'-73.96051952422872',
		'url':'pictures/88.png'
	},
	{
		'title':'Bedford-Stuyvesant',
		'lat':'40.680382306749664',
		'lon':'-73.94953490229742',
		'url':'pictures/bedford.jpg'
	},
	{
		'title':'Crown Heights',
		'lat':'40.67344407236326',
		'lon':'-73.94192040414453',
		'url':'pictures/crownheights.jpg'
	},
	{
		'title':'McCarren Park',
		'lat':'40.720775175190546',
		'lon':'-73.95128898960765',
		'url':'pictures/mccarrenpark.jpg'
	},
	{
		'title':'Jackson Heights',
		'lat':'40.75672647491698',
		'lon':'-73.87548937345977',
		'url':'pictures/jacksonheights.jpg'
	},
	{
		'title':'Astoria Park',
		'lat':'40.778138287367774',
		'lon':'-73.92412106252507',
		'url':'pictures/astoriapark.jpg'
	},
	{
		'title':'Fordham Heights',
		'lat':'40.85739108245312',
		'lon':'-73.89997981196863',
		'url':'pictures/fordhamheights.jpg'
	},
	{
		'title':'South Bronx',
		'lat':'40.81714538359536',
		'lon':'-73.91924770229308',
		'url':'pictures/southbronx.jpg'
	},
	{
		'title':'Mott Haven',
		'lat':'40.80871955221862',
		'lon':'-73.92246985689256',
		'url':'pictures/motthaven.jpg'
	},
	{
		'title':'Harlem',
		'lat':'40.80941594856881',
		'lon':'-73.94824837873159',
		'url':'pictures/harlem.png'
	},
	{
		'title':'Central Park',
		'lat':'40.79057821856398',
		'lon':'-73.96032895666951',
		'url':'pictures/centralpark.jpg'
	},
	{
		'title':'Gracie Mansion',
		'lat':'40.776363042999066',
		'lon':'-73.94348851152839',
		'url':'pictures/graciemansion.jpg'
	},
	{
		'title':'Columbus Circle',
		'lat':'40.76797798893281',
		'lon':'-73.98152190229466',
		'url':'pictures/columbuscircle.jpg'
	},
	{
		'title':'Times Square',
		'lat':'40.75791772547082',
		'lon':'-73.98569282236338',
		'url':'pictures/timessquare.jpg'
	},
	{
		'title':'Union Square',
		'lat':'40.735478925133535',
		'lon':'-73.99057677317711',
		'url':'pictures/unionsquare.jpg'
	},
	{
		'title':'Washington Square Park',
		'lat':'40.73054224702604',
		'lon':'-73.99817959666248',
		'url':'pictures/washington.jpg'
	},
	{
		'title':'Tribeca',
		'lat':'40.71793945933767',
		'lon':'-74.00855589556477',
		'url':'pictures/tribeca.jpg'
	},
	{
		'title':'City Hall',
		'lat':'40.712669242608136',
		'lon':'-74.00615263832182',
		'url':'pictures/cityhall.jpg'
	},
	{
		'title':'Brooklyn Bridge',
		'lat':'40.70590665111006',
		'lon':'-73.99666026951715',
		'url':'pictures/brooklynbridge.jpg'
	},
	{
		'title':'Staten Island',
		'lat':'40.60105893415586',
		'lon':'-74.09152896925836',
		'url':'pictures/statenisland.jpg'
	}
]

// initialize
$( document ).ready(function() {
    createMap(protest, protestmarkers, lat,lon,zl);
	getGeoJSON();
	readCSV(path);
});

// create the map
function createMap(protest, protestmarkers,lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	//add contextual images
	var imageIcon = L.icon({
		iconUrl: 'pictures/protest.png',
		iconSize: [15, 15]
	});


	protest.forEach(function(item,index){
		// create marker
		let marker = L.marker([item.lat,item.lon], {icon: imageIcon})
		.on('mouseover', function(){
			this.bindPopup(`<h2>${item.title}</h2> <img style="max-width: 200px" src=${item.url}></img>`, {maxWidth: "auto"}).openPopup()
		})

		// add marker to featuregroup		
		protestmarkers.addLayer(marker)
	})

	protestmarkers.addTo(map)
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
			black = globaldata.data.filter(data => data.PERP_RACE=='BLACK');
			hispanic = globaldata.data.filter(data => data.PERP_RACE=='BLACK HISPANIC' | data.PERP_RACE=='WHITE HISPANIC');
			white = globaldata.data.filter(data => data.PERP_RACE=='WHITE');
			other = globaldata.data.filter(data => data.PERP_RACE=='AMERICAN INDIAN/ALASKAN NATIVE' | data.PERP_RACE=='UNKNOWN');
			
			// map the data	
			mapCSV(aapi, aapimarkers, '#1681c4', 'Asian/Pacific Islanders');
			mapCSV(black, blackmarkers, '#1667c4', 'Black');
			mapCSV(hispanic, hispanicmarkers, '#164dc4', 'Hispanic')
			mapCSV(white, whitemarkers, '#1633c4', 'White');
			mapCSV(other, othermarkers, '#1b16c4', 'Other');

			let layers = {
				"Asian/Pacific Islanders": aapimarkers,
				"Black": blackmarkers,
				"White": whitemarkers,
				"Hispanic": hispanicmarkers,
				"Other": othermarkers,
			};

			//L.control.layers(null, layers).addTo(map)

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
	//featuregroup.addTo(map)

	// fit markers to map
	//map.fitBounds(featuregroup.getBounds())
}

// function to get the geojson data
function getGeoJSON(field){

	$.getJSON(geojsonPath,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON(field)
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
	let values = [0,1];

	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function(item,index){
		values.push(item.properties[field])
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(5);
	brew.setColorCode('Reds');
	brew.classify('equal_interval');

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data, {
		style: getStyle, //call a function to style each feature
		onEachFeature: onEachFeature // actions on each feature
	}).addTo(map);

	map.fitBounds(geojson_layer.getBounds());

	createLegend();

	createInfoPanel();

	geojson_layer.bringToBack();
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
		labels = ['<strong>Population Proportion</strong>'],
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
		click: openFeature
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
	 	//layer.bringToBack();
	// }

	info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);
	info_panel.update() // resets infopanel
}

//on mouse click on a feature, open window with info
function openFeature(e) {
	window.open(e.target.feature.properties.win_url)
}

// on mouse click on a feature, zoom in to it
// function zoomToFeature(e) {
// 	map.fitBounds(e.target.getBounds());
// }

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
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: <b>${properties[fieldtomap]}</b><br>Click on the borough for more info.`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a borough to see population density for selected demographic group.';
		}
	};

	info_panel.addTo(map);
}

// Home Page Buttons using ID
var asianbutton = document.getElementById('asian')

asianbutton.onclick = function(event){
	event.preventDefault();
	getGeoJSON('asian');
	if(map.hasLayer(aapimarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(aapimarkers);
	} 
	if(map.hasLayer(blackmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(blackmarkers);
	} 
	if(map.hasLayer(hispanicmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(hispanicmarkers);
	} 
	if(map.hasLayer(whitemarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(whitemarkers);
	} 
	if(map.hasLayer(othermarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(othermarkers);
	} 
	map.addLayer(aapimarkers);
	aapimarkers.bringToFront();
	$(this).addClass('selected');
}

var blackbutton = document.getElementById('black')

blackbutton.onclick = function(event){
	event.preventDefault();
	getGeoJSON('black');
	if(map.hasLayer(aapimarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(aapimarkers);
	} 
	if(map.hasLayer(blackmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(blackmarkers);
	} 
	if(map.hasLayer(hispanicmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(hispanicmarkers);
	} 
	if(map.hasLayer(whitemarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(whitemarkers);
	} 
	if(map.hasLayer(othermarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(othermarkers);
	} 
	map.addLayer(blackmarkers);
	blackmarkers.bringToFront();
	$(this).addClass('selected');
}

var hispanicbutton = document.getElementById('hispanic')

hispanicbutton.onclick = function(event){
	event.preventDefault();
	getGeoJSON('hispanic');
	if(map.hasLayer(aapimarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(aapimarkers);
	} 
	if(map.hasLayer(blackmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(blackmarkers);
	} 
	if(map.hasLayer(hispanicmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(hispanicmarkers);
	} 
	if(map.hasLayer(whitemarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(whitemarkers);
	} 
	if(map.hasLayer(othermarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(othermarkers);
	} 
	map.addLayer(hispanicmarkers);
	hispanicmarkers.bringToFront();
	$(this).addClass('selected');
}

var whitebutton = document.getElementById('white')

whitebutton.onclick = function(event){
	event.preventDefault();
	getGeoJSON('white');
	if(map.hasLayer(aapimarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(aapimarkers);
	} 
	if(map.hasLayer(blackmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(blackmarkers);
	} 
	if(map.hasLayer(hispanicmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(hispanicmarkers);
	} 
	if(map.hasLayer(whitemarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(whitemarkers);
	} 
	if(map.hasLayer(othermarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(othermarkers);
	} 
	map.addLayer(whitemarkers);
	whitemarkers.bringToFront();
	$(this).addClass('selected');
}

var otherbutton = document.getElementById('other')

otherbutton.onclick = function(event){
	event.preventDefault();
	getGeoJSON('other');
	if(map.hasLayer(aapimarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(aapimarkers);
	} 
	if(map.hasLayer(blackmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(blackmarkers);
	} 
	if(map.hasLayer(hispanicmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(hispanicmarkers);
	} 
	if(map.hasLayer(whitemarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(whitemarkers);
	} 
	if(map.hasLayer(othermarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(othermarkers);
	} 
	map.addLayer(othermarkers);
	othermarkers.bringToFront();
	$(this).addClass('selected');
}

var resetbutton = document.getElementById('reset')

resetbutton.onclick = function(event){
	event.preventDefault();
	getGeoJSON('reset');
	if(map.hasLayer(aapimarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(aapimarkers);
	} 
	if(map.hasLayer(blackmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(blackmarkers);
	} 
	if(map.hasLayer(hispanicmarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(hispanicmarkers);
	} 
	if(map.hasLayer(whitemarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(whitemarkers);
	} 
	if(map.hasLayer(othermarkers)) {
		$(this).removeClass('selected');
		map.removeLayer(othermarkers);
	} 
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

