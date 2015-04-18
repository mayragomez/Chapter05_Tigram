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


function initializePushNotifications(_user) {

  Alloy.Globals.pushToken = null;
  var pushLib = require('pushNotifications');

  // initialize PushNotifications
  pushLib.initialize(_user,
  // notification received callback
  function(_pushData) {
    Ti.API.info('I GOT A PUSH NOTIFICATION');
    // get the payload from the proper place depending
    // on what platform you are on
    var payload;

    try {
      if (_pushData.payload) {
        payload = JSON.parse(_pushData.payload);
      } else {
        payload = _pushData;
      }
    } catch(e) {
      payload = {};
    }

    // display the information in an alert
    if (OS_ANDROID) {
      Ti.UI.createAlertDialog({
        title : payload.android.title || "Alert",
        message : payload.android.alert || "",
        buttonNames : ['Ok']
      }).show();
    } else {
      Ti.UI.createAlertDialog({
        title : "Alert",
        message : payload.alert || "",
        buttonNames : ['Ok']
      }).show();
    }

  },
  // registration callback parameter
  function(_pushInitData) {
    if (_pushInitData.success) {
      // save the token so we know it was initialized
      Alloy.Globals.pushToken = _pushInitData.data.deviceToken;

      Ti.API.debug("Success: Initializing Push Notifications " + JSON.stringify(_pushInitData));
    } else {
      alert("Error Initializing Push Notifications");
      Alloy.Globals.pushToken = null;
    }
  });
}//ch11



$.loginSuccessAction = function(_options) {
	
	 initializePushNotifications(_options.model);//ch11

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
			//indexController.loginSuccessAction(_response);
			$.loginSuccessAction(_response);
		} else {
			alert("Application Error\n " + _response.error.message);
			Ti.API.error(JSON.stringify(_response.error, null, 2));

			// go ahead and do the login
			$.userNotLoggedInAction();
		}
	});
};//end UserLoggedInAction ch7

// when we start up, create a user and log in
var user = Alloy.createModel('User');


if (user.authenticated() === true) {
	$.userLoggedInAction();
} else {
	$.userNotLoggedInAction();
}
//ch7
Alloy.Globals.openCurrentTabWindow = function(_window) {
	$.tabGroup.activeTab.open(_window);
}; //chapter6
