var args = arguments[0] || {};

$.parentController = args.parentController;

//chapter 7
$.showLoginBtn.addEventListener('click', showLoginBtnClicked);
$.showCreateAccountBtn.addEventListener('click', showCreateAccountBtnClicked);
$.cancelCreateAcctBtn.addEventListener('click', cancelActionButtonClicked);
$.cancelLoginBtn.addEventListener('click', cancelActionButtonClicked);

$.doLoginBtn.addEventListener('click', doLoginBtnClicked);
$.doCreateAcctBtn.addEventListener('click', doCreateAcctBtnClicked);

//faceboook login ch7
$.showLoginFBBtn.addEventListener('click', doFacebookLoginAction);
function showLoginBtnClicked() {
	
	$.createAcctView.hide();
	$.homeView.hide();
	$.loginView.show();
};//end showLoginBtnClicked ch7

function showCreateAccountBtnClicked() {
	$.createAcctView.show();
	$.homeView.hide();
	$.loginView.hide();
};//end showCreateAccountBtnClicked ch7

function cancelActionButtonClicked() {
	$.createAcctView.hide();
	$.loginView.hide();

	// set the global login state to false
	Alloy.Globals.loggedIn = false;

	// display only the home state view
	$.homeView.show();
}//end cancelActionButtonClicked ch7

function doLoginBtnClicked() {

	// create instance of the user model
	var user = Alloy.createModel('User');

	// call the extended model’s function
	user.login($.email.value, $.password.value, userActionResponseHandler);
};//end doLoginBtnClicked ch7

function userActionResponseHandler(_resp) {
	if (_resp.success === true) {

		// Do stuff after successful login.
		Alloy.Globals.loggedIn = true;
		Alloy.Globals.CURRENT_USER = _resp.model;

		$.parentController.loginSuccessAction(_resp);

	} else {
		// Show the error message and let the user try again.
		alert("loginFailed", _resp.error.message);

		Alloy.Globals.CURRENT_USER = null;
		Alloy.Globals.loggedIn = false;
	}
};//end  userActionResponseHandler ch7

function doCreateAcctBtnClicked() {
	if ($.acct_password.value !== $.acct_password_confirmation.value) {
		alert("Please re-enter information");
		return;
	}

	var params = {
		first_name : $.acct_fname.value,
		last_name : $.acct_lname.value,
		username : $.acct_email.value,
		email : $.acct_email.value,
		password : $.acct_password.value,
		password_confirmation : $.acct_password_confirmation.value,
	};

	var user = Alloy.createModel('User');

	user.createAccount(params, userActionResponseHandler);
};//end doCreateAcctBtnClicked ch7

function faceBookLoginEventHandler(_event) {

	Alloy.Globals.FB.removeEventListener('login', faceBookLoginEventHandler);

	if (_event.success) {
		doFacebookLoginAction(_event.data);
	} else if (_event.error) {
		alert(_event.error);
	} else {
		_event.cancelled && alert("User Canceled");
	}
};//end faceBookLoginEventHandler ch7

function faceBookLoginErrorHandler(_user, _error) {
	
	// Show the error message somewhere and let the user try again.
	alert("Error: " + _error.code + " " + _error.message);

	Alloy.Globals.loggedIn = false;
	Alloy.Globals.CURRENT_USER = null;
};//end faceBookLoginErrorHandler ch7

function doFacebookLoginAction(_options) {
	var FB = Alloy.Globals.FB;
	
	if (FB.loggedIn === false) {
		//enabling single sign on using FB
		FB.forceDialogAuth = false;

		// get the app id
		FB.appid = Ti.App.Properties.getString("ti.facebook.appid");

		// set permissions
		FB.permissions = ["read_stream"];

		// login handler with callback
		FB.addEventListener("login", faceBookLoginEventHandler);

		// attempt to authorize user
		FB.authorize();

	} else {
		var user = Alloy.createModel('User');
		user.updateFacebookLoginStatus(FB.accessToken, {
			success : function(_resp) {

				Ti.App.Properties.setString("loginType", "FACEBOOK");

				Alloy.Globals.loggedIn = true;
				Alloy.Globals.CURRENT_USER = _resp.model;

				// save the newly created facebook user
				if (!_resp.model.get("username") && _options.email) {
					_resp.model.save(
						{
						"email" : _options.email,
						"username" : _options.username
						},{
							success : function(_user, _response)
							{
								$.parentController.loginSuccessAction(_resp);
								Alloy.Globals.CURRENT_USER = _user;
							},
							error : faceBookLoginErrorHandler
						}
					);
				} else {
					$.parentController.loginSuccessAction(_resp);
				}
			},
			error : faceBookLoginErrorHandler
		});
	}
}//end doFacebookLoginAction ch7



$.open = function(_reset) {
	_reset && cancelActionButtonClicked();
	$.index.open();
};

$.close = function() {
	$.index.close();
}; 
