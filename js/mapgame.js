//mapgame.js
var score = 100;
var correct = 0;
var total = 0;
var wrong = 0;

$(document).ready(function () {
	// establishing jqueryui elements
	$( "#dialogbox").dialog({
		buttons: {
			"Let's Go!": function () {
			$(this).dialog("close");
			startGame();
			}
		},
	});
	$("#dialogloser").dialog({
		buttons: {
			"Play again?": function () {
				restart();
			}
		}
	});
	$("#dialogwinner").dialog({
		buttons: {
			"Play again?": function () {
				restart();
			}
		}});
	$(".button").button();
	
	// actual actions
	$("#dialogbox").dialog("open");	
	$("#dialogloser").dialog("close");
	$("#dialogwinner").dialog("close");
	$("#restart").click(function () {
		restart();
	});
	$("#hints").click(function(){
		if ($("#hints").hasClass("pressed")) {
			removeHints();
			$("#hints").removeClass("pressed");
			document.getElementById("hints").firstChild.innerHTML = 'Show Hints';
		} else {
			showHints();
			$("#hints").addClass("pressed");
			document.getElementById("hints").firstChild.innerHTML = 'Hide Hints';
		}
	});

});

function showHints(){
	map.setOptions(
		{styles:[
			{
				stylers: {visibility: 'simplified'}
			},
			{
				elementType: 'labels',
				stylers: [
					{visibility: 'on'}
				]
			},
			{
				featureType: 'road',
				elementType: 'labels',
				stylers: [
					{visibility: 'on'}
				]
			}
		]
	});
}

function removeHints(){
	map.setOptions(
		{styles: [
			{
				stylers: {visibility: 'simplified'}
			},
			{
				elementType: 'labels',
				stylers: [
					{visibility: 'off'}
				]
			},
			{
				featureType: 'road',
				elementType: 'labels',
				stylers: [
					{visibility: 'on'}
				]
			}
		]
	});
}

function restart () {
	initialize();
	score = 100;
	correct = 0;
	total = 0;
	wrong = 0;
	$("#dialogloser").dialog("close");
	$("#dialogwinner").dialog("close");
	$("#hp").css("width", score + "%");
	$("#dialogbox").dialog("open");
}

function startGame () {
	performSearch();
}

var map;
var mapOpts;
var infoWindow;
var service;
var diff;
var str = "";

function initialize() {
	mapOpts = {
		zoom: 16,
		center: new google.maps.LatLng(41.6564208,-91.5332455),
		styles : [
			{
				stylers: {visibility: 'simplified'}
			},
			{
				elementType: 'labels',
				stylers: [
					{visibility: 'off'}
				]
			},
			{
				featureType: 'road',
				elementType: 'labels',
				stylers: [
					{visibility: 'on'}
				]
			}
		]
	}
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		// Browser doesn't support Geolocation
		handleNoGeolocation(false);
	}
  
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOpts);

	infoWindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }
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
   total++;
    createMarker(result);
  }
	diff = Math.ceil(total/15);
	if (diff <= 0) diff = 1;
	if (diff >= 6) diff = 5;
	str = "";
	for (var i=0; i < diff ;i++) {
		str += "&#x2605;";
	}
	document.getElementById("difficulty").innerHTML = ' Difficulty: <span id="stars">' + str + "</span>";
	document.getElementById("scorer").innerHTML = "Score: " + correct + "/" + total;
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
      
      var guess= document.getElementById('guess');
	  if (guess.value.length < 4) {
		$("#charlength").css("opacity", "1");
	  } else {
		$("#charlength").css("opacity", "0");
		  if (status != google.maps.places.PlacesServiceStatus.OK) {
			alert(status);
			return;
		  }
		  infoWindow.setContent(result.name);
		  if (result.name.toLowerCase().indexOf(guess.value.toLowerCase()) >= 0){
			correct++;
			$("#right").css("opacity", "1");
			setTimeout(function() { $("#right").css("opacity", "0"); }, 2000);
		  } else {
			score -= 20;
			wrong++;
			$("#wrong").css("opacity", "1");
			$("#wrong").html("The Answer is: "+result.name);
			setTimeout(function() { $("#wrong").css("opacity", "0"); }, 2000);
			$("#hp").css("width", score + "%");
			if (score < 1) {
				$("#dialogloser").dialog("open");
				setTimeout( function () {$("#hpbar").effect("shake", {direction: "up", distance: 10});}, 1000);
			}
		  }
		  infoWindow.open(map, marker);
		  document.getElementById("scorer").innerHTML = "Score: " + correct + "/" + total;
		  if (correct >= (total-wrong)){
			$("#dialogwinner").dialog("open");
		  }
		  marker.setMap(null);
	  
	  }
	  
    }); 
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

