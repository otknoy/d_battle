var Data = {};

Data.loadFile = function(filename) {
    var deferred = Promise.defer();

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
	deferred.resolve(xhr.responseText);
    };

    xhr.open("GET", filename, true);
    xhr.send(null);

    return deferred.promise;
};

Data.loadOsakaPlaces = function() {
    var deferred = Promise.defer();

    function parseToMatrix(csv_text) {
	var LF = String.fromCharCode(10);
	var rows = csv_text.split(LF);

	var data = [];
	for (var i = 0; i < rows.length; i++) {
	    var cells = rows[i].split(",");
	    data.push(cells);
	}
	return data;
    }

    function parseToDict(data) {
	var dict = [];

	var labels = data[0];
	for (var i = 1; i < data.length; i++) {
	    var item = {};
	    for (var j = 0; j < data[i].length; j++) {
		var key = labels[j];
		var value = data[i][j];
		item[key] = value;
	    }

	    item = {
		"latitude":  parseFloat(item["Y"]),
		"longitude": parseFloat(item["X"]),
		"name": item["施設名"],
		"icon_number": item["アイコン番号"]
	    };

	    dict.push(item);
	}

	return dict;
    }

    Data.loadFile("data/mapnavoskdat_icon.csv")
	.then(function(icon_data) {
	    var items = parseToMatrix(icon_data);
	    items = items.slice(1, items.length-1);
	    var id2place = {};
	    for (var i = 0; i < items.length; i++) {
		id2place[items[i][0]] = items[i][1];
	    }

	    Data.loadFile("data/mapnavoskdat_shisetsuall.csv")
		.then(function(csv_data) {
		    var data = parseToMatrix(csv_data);
		    data = parseToDict(data);

		    deferred.resolve(data);
		});
	});

    return deferred.promise;
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
