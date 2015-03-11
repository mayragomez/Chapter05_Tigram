function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doOpen() {
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    var __alloyId4 = [];
    $.__views.feedController = Alloy.createController("feed", {
        id: "feedController"
    });
    __alloyId4.push($.__views.feedController.getViewEx({
        recurse: true
    }));
    $.__views.friendsController = Alloy.createController("friends", {
        id: "friendsController"
    });
    __alloyId4.push($.__views.friendsController.getViewEx({
        recurse: true
    }));
    $.__views.settingsController = Alloy.createController("settings", {
        id: "settingsController"
    });
    __alloyId4.push($.__views.settingsController.getViewEx({
        recurse: true
    }));
    $.__views.tabGroup = Ti.UI.createTabGroup({
        tabs: __alloyId4,
        id: "tabGroup"
    });
    $.__views.tabGroup && $.addTopLevelView($.__views.tabGroup);
    doOpen ? $.__views.tabGroup.addEventListener("open", doOpen) : __defers["$.__views.tabGroup!open!doOpen"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var user = Alloy.createModel("User");
    user.login("tigram_admin", "tigramadmin", function(_response) {
        if (_response.success) $.tabGroup.open(); else {
            alert("Error starting application " + _response.error);
            Ti.API.error("error logging in " + _response.error);
        }
    });
    __defers["$.__views.tabGroup!open!doOpen"] && $.__views.tabGroup.addEventListener("open", doOpen);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;