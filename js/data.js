var Data = {};

Data.loadCSVFile = function(filename) {
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

Data.parseData = function(data) {
    return {
	"latitude":  parseFloat(data["Y"]),
	"longitude": parseFloat(data["X"]),
	"name": data["施設名"],
	"icon_number": data["アイコン番号"]
    };
};

Data.filterByRegion = function(data, lat1, lng1, lat2, lng2) {
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

Data.sample = function(data, n) {
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

Data.filter = function(data, lat1, lng1, lat2, lng2, sample) {
    data = Data.filterByRegion(data, lat1, lng1, lat2, lng2);
    data = Data.sample(data, sample);
    return data;
};

Data.places = 0;
