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
	$(".button").button();
	
	// actual actions
	$("#dialogbox").dialog("open");	
	$("#restart").click(function () {
    initialize();
		$("#dialogbox").dialog("open");
	});
	
});

function startGame () {
	performSearch();
}

var map;
var infoWindow;
var service;

function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 16,
    center: new google.maps.LatLng(41.6564208,-91.5332455)
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  //google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
}

function performSearch() {
  var searchType = $("#location").val();
  var request = {
    bounds: map.getBounds(),
    keyword: searchType
  };
  service.radarSearch(request, callback);
}

function callback(results, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  for (var i = 0, result; result = results[i]; i++) {
    createMarker(result);
  }
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      // Star
      //path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
      path: 'M 10, 10 m -20, 0 a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0',
	  fillColor: '#7CC2DD',
      fillOpacity: 1,
      scale: 1/4,
      strokeColor: '#1583B5',
      strokeWeight: 1 
	  // url: "./images/circle.png"
    }
  });

  google.maps.event.addListener(marker, 'click', function() {
   service.getDetails(place, function(result, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }
      var guess= document.getElementById('guess');
      infoWindow.setContent(result.name);
      if(result.name!=guess.value){
        alert('oh, you are so wrong.');
      }
      if(result.name==guess.value){
        alert('so proud. you right');
      }
      infoWindow.open(map, marker);
	  
    }); 
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

