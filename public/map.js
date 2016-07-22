geocoder = new google.maps.Geocoder();

function getCoordinates (address, callback){
	var coordinates = [];
	geocoder.geocode({address: address}, function(results, status){
		coordinates[0] = results[0].geometry.location.lat();
		coordinates[1] = results[0].geometry.location.lng();
			callback(coordinates);
	});
}