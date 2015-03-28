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

$.loginSuccessAction = function(_options) {

	Ti.API.info('logged in user information');
	Ti.API.info(JSON.stringify(_options.model, null, 2));

	// open the main screen
	$.tabGroup.open();

	// set tabGroup to initial tab, in case this is coming from
	// a previously logged in state
	$.tabGroup.setActiveTab(0);

	// pre-populate the feed with recent photos
	$.feedController.initialize();

	// get the current user
	Alloy.Globals.currentUser = _options.model;

	// set the parent controller for all of the tabs, give us
	// access to the global tab group and misc functionality
	$.feedController.parentController = $;
	$.friendsController.parentController = $;
	$.settingsController.parentController = $;

	// do any necessary cleanup in login controller
	$.loginController && $.loginController.close();
};//end LoginSuccessAction ch7

$.userNotLoggedInAction = function() {
	// open the login controller to login the user
	if (!$.loginController) {
		var loginController = Alloy.createController("login", {
			parentController : $,
			reset : true
		});

		// save controller so we know not to create one again
		$.loginController = loginController;
	}

	// open the window
	$.loginController.open(true);

};//end user not UserNotLoggedInAction ch7

$.userLoggedInAction = function() {
	user.showMe(function(_response) {
		if (_response.success === true) {
			//call the user logged in action
			indexController.loginSuccessAction(_response);
			//$.loginSuccessAction(_response);
		} else {
			alert("Application Error\n " + _response.error.message);
			Ti.API.error(JSON.stringify(_response.error, null, 2));

			// go ahead and do the login
			$.userNotLoggedInAction();
		}
	});
};//end UserLoggedInAction ch7

if (user.authenticated() === true) {
	$.userLoggedInAction();
} else {
	$.userNotLoggedInAction();
}
//ch7
Alloy.Globals.openCurrentTabWindow = function(_window) {
	$.tabGroup.activeTab.open(_window);
}; //chapter6
