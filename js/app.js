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

    function parseCSV(csv) {
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
	deferred.resolve(parseCSV(xhr.responseText));
    };

    xhr.open("GET", filename, true);
    xhr.send(null);

    return deferred.promise;
};
