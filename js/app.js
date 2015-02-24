var app = {};

app.getGeolocation = function() {
    var deferred = Promise.defer();

    if ("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(function(position) {
	    deferred.resolve(position.coords);
	});
    } else {
	deferred.reject("Geolocation API is not available.");
    }

    return deferred.promise;
};

app.loadCSVFile = function(filename) {
    var deferred = Promise.defer();

    function parse(csv) {
	var LF = String.fromCharCode(10);
	var rows = xhr.responseText.split(LF);
	var labels = rows[0].split(",");

	var data = [];
	for (var i = 1; i < rows.length; i++) {
	    var item = {};
	    var cells = rows[i].split(",");
	    for (var j = 0; j < cells.length; j++) {
		var key = labels[j];
		var value = cells[j];
		item[key] = value;
	    }
	    data.push(item);
	}
	return data;
    }

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
	deferred.resolve(parse(xhr.responseText));
    };

    xhr.open("GET", filename, true);
    xhr.send(null);

    return deferred.promise;
};

app.parseData = function(data) {
    return {
	"latitude":  parseFloat(data["Y"]),
	"longitude": parseFloat(data["X"]),
	"name": data["施設名"],
	"icon_number": data["アイコン番号"]
    };
};

app.filterDataByRegion = function(data, lat1, lng1, lat2, lng2) {
    var filteredData = [];
    for (var i = 0; i < data.length; i++) {
	var d = data[i];

	if (lat1 < d.latitude  && d.latitude  < lat2 &&
	    lng1 < d.longitude && d.longitude < lng2) {
	    filteredData.push(d);
	}
    }
    return filteredData;
};

app.sampleData = function(data, n) {
    function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (data.length < n) {
	return data;
    }

    var samples = [];
    for (var i = 0; i < n; i++) {
	var j = getRandomInt(0, data.length-1);
	samples.push(data[j]);
	data.splice(j, 1);
    }
    return samples;
};


app.map = {};

app.map.createMap = function(id, lat, lng, zoom) {
    var mapOptions = {
	center: new google.maps.LatLng(lat, lng),
	zoom: zoom
    };
    var map = new google.maps.Map(document.getElementById(id), mapOptions);
    return map;
};

app.map.getMapBounds = function(map) {
    var mapBounds = map.getBounds();
    var sw = mapBounds.getSouthWest();
    var ne = mapBounds.getNorthEast();
    var bounds = {
	'lat1': sw.lat(), 'lng1': sw.lng(),
	'lat2': ne.lat(), 'lng2': ne.lng()
    };
    return bounds;
};

app.map.createCircle = function(map, lat, lng, r) {
    var options = {
	strokeColor: '#FF0000',
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: '#FF0000',
	fillOpacity: 0.35,
	map: map,
	center: new google.maps.LatLng(lat, lng),
	radius: r
    };
    var circle = new google.maps.Circle(options);
    return circle;
};
