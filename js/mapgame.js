//mapgame.js

$(document).ready(function () {

	// establishing jqueryui elements
	$( ".uiselectmenu" ).selectmenu();
	$( ".uibutton" ).button();
	$( ".ui-dialog").dialog({
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