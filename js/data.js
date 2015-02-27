var Data = {};

Data.loadFile = function(filename) {
    var dfd = Promise.defer();

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
	dfd.resolve(xhr.responseText);
    };

    xhr.open("GET", filename, true);
    xhr.send(null);

    return dfd.promise;
};

Data.parseCSV = function(csv_text) {
    var LF = String.fromCharCode(10);
    var rows = csv_text.split(LF);

    var data = [];
    for (var i = 0; i < rows.length; i++) {
	var cells = rows[i].split(",");
	data.push(cells);
    }
    return data;
};


Data.csv2dict = function(csv) {
    var dict = [];

    var labels = csv[0];
    for (var i = 1; i < csv.length; i++) {
	var item = {};
	for (var j = 0; j < csv[i].length; j++) {
	    var key = labels[j];
	    var value = csv[i][j];
	    item[key] = value;
	}
	dict.push(item);
    }

    return dict;
};


Data.places = [
    "交番",
    "公園",
    "幼稚園",
    "保育園",
    "図書館",
    "小学校",
    "中学校",
    "高等学校",
    "専門学校",
    "短期大学・大学",
    "銀行",
    "市役所・町村役場",
    "区役所",
    "職業安定所"
];

Data.id2place = {
    "119": "交番",
    "154": "公園",
    "125": "幼稚園",
    "124": "保育園",
    "151": "図書館",
    "126": "小学校",
    "127": "中学校",
    "128": "高等学校",
    "129": "専門学校",
    "130": "短期大学・大学",
    "203": "銀行",
    "100": "市役所・町村役場",
    "101": "区役所",
    "11": "職業安定所"
};


Data.parseOsakaData = function(dictArray) {
    return dictArray.map(function(dict) {
	// X,Y,施設名,施設名かな,施設名（施設名かな）,所在地,地区名,TEL,FAX,詳細情報,開館時間,URL,バリアフリー情報,駐輪場 PC,駐輪場 携,大分類,小分類,カテゴリ,アイコン番号,施設ID
	var item = {
	    "id": parseInt(dict["施設ID"]),
	    "latitude": parseFloat(dict["X"]),
	    "longitude": parseFloat(dict["Y"]),
	    "name": dict["施設名"],
	    "icon_number": parseInt(dict["アイコン番号"])
	};

	return item;
    });
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
