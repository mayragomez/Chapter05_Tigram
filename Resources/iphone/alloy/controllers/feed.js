function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function processImage(_mediaObject, _callback) {
        var parameters = {
            photo: _mediaObject,
            title: "Sample Photo " + new Date(),
            "photo_sizes[preview]": "200x200#",
            "photo_sizes[iphone]": "320x320#",
            "photo_sync_sizes[]": "preview"
        };
        var photo = Alloy.createModel("Photo", parameters);
        photo.save({}, {
            success: function(_model) {
                Ti.API.debug("success: " + _model.toJSON());
                _callback({
                    model: _model,
                    message: null,
                    success: true
                });
            },
            error: function(e) {
                Ti.API.error("error: " + e.message);
                _callback({
                    model: parameters,
                    message: e.message,
                    success: false
                });
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "feed";
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
    $.__views.feedWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "feedWindow",
        title: "Feed"
    });
    $.__views.cameraButton = Ti.UI.createButton({
        title: "Camera",
        id: "cameraButton"
    });
    $.__views.feedWindow.rightNavButton = $.__views.cameraButton;
    $.__views.feedTable = Ti.UI.createTableView({
        id: "feedTable"
    });
    $.__views.feedWindow.add($.__views.feedTable);
    $.__views.feedTable = Ti.UI.createTab({
        window: $.__views.feedWindow,
        id: "feedTable",
        title: "Feed"
    });
    $.__views.feedTable && $.addTopLevelView($.__views.feedTable);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    true && $.cameraButton.addEventListener("click", function(_event) {
        $.cameraButtonClicked(_event);
    });
    $.cameraButtonClicked = function() {
        alert("User clicked the camera button");
        var photoSource = Titanium.Media.getIsCameraSupported() ? Titanium.Media.showCamera : Titanium.Media.openPhotoGallery;
        photoSource({
            success: function(event) {
                processImage(event.media, function(processResponse) {
                    if (processResponse.success) {
                        var row = Alloy.createController("feedRow", processResponse.model);
                        if (0 === $.feedTable.getData().length) {
                            $.feedTable.setData([]);
                            $.feedTable.appendRow(row.getView(), true);
                        } else $.feedTable.insertRowBefore(0, row.getView(), true);
                    } else alert("Error saving photo " + processResponse.message);
                });
            },
            cancel: function() {},
            error: function(error) {
                alert(error.code == Titanium.Media.NO_CAMERA ? "Please run this test on a device" : "Unexpected error" + error.code);
            },
            saveToPhotoGallery: false,
            allowEditing: true,
            mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ]
        });
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;