function doOpen() {

  if (OS_ANDROID) {
  	
    var activity = $.getView().activity;
    var menuItem = null;

    activity.onCreateOptionsMenu = function(e) {

	if ($.tabGroup.activeTab.title === "Feed") {

        menuItem = e.menu.add({
          title : "Take Photo",
          showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
          icon : Ti.Android.R.drawable.ic_menu_camera
        });

        menuItem.addEventListener("click", function(e) {
          $.feedController.cameraButtonClicked();
        });
      }
    };

    activity.invalidateOptionsMenu();

    // this forces the menu to update when the tab changes
    $.tabGroup.addEventListener('blur', function(_event) {
      $.getView().activity.invalidateOptionsMenu();
    });
  }
}

// when we start up, create a user and log in
var user = Alloy.createModel('User');

// we are using the default administration account for now
user.login("tigram_admin", "tigramadmin", function(_response) {
	
	if(_response.success)
	{
		//open the main screen
		$.tabGroup.open();
		
		//pre-populate the feed with recent photos
	  //	$.feedController.initialize();
	}
	else
	{
  		alert("Error starting application " + _response.error);
  		Ti.API.error('error logging in ' + _response.error);
	}
});