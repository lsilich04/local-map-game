//mapgame.js

$(document).ready(function () {

	// establishing jqueryui elements
	$( ".dialog").dialog({
		buttons: {
				"Let's Go!": function () {
					$(this).dialog("close");
					startGame();
				}
		},
	});
	
	// actual actions
	$("#dialogbox").dialog("open");	
});

function startGame () {
	// called from the dialog close button!
	// put some gmaps stuff here probably?
	console.log("Check!");
}

var map;
function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(41.6564248,-91.5332455)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);

