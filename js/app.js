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

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
	var csv = [];
	var LF = String.fromCharCode(10);
	var lines = xhr.responseText.split(LF);
	for (var i = 0; i < lines.length;++i) {
	    var cells = lines[i].split(",");
	    if(cells.length != 1) {
		csv.push(cells);
	    }
	}
	deferred.resolve(csv);
    };

    xhr.open("GET", filename, true);
    xhr.send(null);

    return deferred.promise;
};
