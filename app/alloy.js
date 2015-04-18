// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

//using facebook in the latest release of appcelerator

//ch7
Alloy.Globals.fbModule = require('facebook');
//ch8
Alloy.Globals.PW = require('progressWindown');
//Ch9
Alloy.Globals.Map = require('ti.map');
//ch10
// if twitter is not loaded/initialized
if (!Alloy.Globals.TW) {
  var TAP = Ti.App.Properties;
  Alloy.Globals.TW = require('social_wiley').create({
    consumerSecret : TAP.getString('twitter.consumerSecret'),
    consumerKey : TAP.getString('twitter.consumerKey')
  });
}
