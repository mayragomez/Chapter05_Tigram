var args = arguments[0] || {};
// load Geolocation library
var geo = require("geo");

OS_IOS && $.cameraButton.addEventListener("click", function(_event) {
	$.cameraButtonClicked(_event);
});

$.feedTable.addEventListener("click", processTableClicks); //chapter 6

function processTableClicks(_event) {
	if (_event.source.id === "commentButton") {
		handleCommentButtonClicked(_event);
	} else if (_event.source.id === "locationButton") {
		handleLocationButtonClicked(_event);
	} else if (_event.source.id === "shareButton") {
		handleShareButtonClicked(_event);
	}
}//chapter6

function handleCommentButtonClicked(_event) {
	var collection,
	    model = null;

	// handle call from mapDetail or feedRow
	if (!_event.row) {
		model = _event.data;
	} else {
		collection = Alloy.Collections.instance("Photo");
		model = collection.get(_event.row.row_id);
	}

	var controller = Alloy.createController("comment", {
		photo : model,
		parentController : $
	});

	// initialize the data in the view, load content
	controller.initialize();

	// open the view
	Alloy.Globals.openCurrentTabWindow(controller.getView());

} //chapter6


function handleLocationButtonClicked(_event) {

  var collection = Alloy.Collections.instance("Photo");
  var model = collection.get(_event.row.row_id);
  

  var customFields = model.get("custom_fields");

  if (customFields && customFields.coordinates) {
    var mapController = Alloy.createController("mapView", {
      photo : model,
      parentController : $
    });

    // open the view
    Alloy.Globals.openCurrentTabWindow(mapController.getView());
  } else {
    alert("No Location was Saved with Photo");
  }
}//ch9

$.cameraButtonClicked = function(_event) {
	alert("User clicked the camera button");

	var photoSource = Titanium.Media.getIsCameraSupported() ? Titanium.Media.showCamera : Titanium.Media.openPhotoGallery;

	photoSource({
		success : function(event) {
			
			processImage(event.media, function(processResponse) {

				if(processResponse.success){
					//create a row
					var row = Alloy.createController("feedRow", processResponse.model);
	
					//add the controller view, which is a row to the table
					if ($.feedTable.getData().length === 0) 
						{
							$.feedTable.setData([]);
							$.feedTable.appendRow(row.getView(), true);
						} 
					else 
						{
							$.feedTable.insertRowBefore(0, row.getView(), true);
						}
						
				 } 
				 else {
					alert('Error saving photo ' + processResponse.message);					
				 }

			});
		},
		cancel : function() {
			//called when the user cancels taking a picture
		},
		error : function(error) {
			//display alert on error
			if (error.code == Titanium.Media.NO_CAMERA) {
				alert("Please run this test on a device");
			} else {
				alert("Unexpected error" + error.code);
			}
		},
		saveToPhotoGallery : false,
		allowEditing : true,
		//only allow for photos, no video
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	});
};

function processImage(_mediaObject, _callback) {

  geo.getCurrentLocation(function(_coords) {
    var parameters = {
      "photo" : _mediaObject,
      "title" : "Sample Photo " + new Date(),
      "photo_sizes[preview]" : "200x200#",
      "photo_sizes[iphone]" : "320x320#",
      // since we are showing the image immediately
      "photo_sync_sizes[]" : "preview"
    };

    // if we got a location, then set it
    if (_coords) {
      parameters.custom_fields = {
        coordinates : [_coords.coords.longitude, _coords.coords.latitude],
        location_string : _coords.title
      };
    }

    var photo = Alloy.createModel('Photo', parameters);

    photo.save({}, {
      success : function(_model, _response) {
        Ti.API.debug('success: ' + _model.toJSON());
        _callback({
          model : _model,
          message : null,
          success : true
        });
      },
      error : function(e) {
        Ti.API.error('error: ' + e.message);
        _callback({
          model : parameters,
          message : e.message,
          success : false
        });
      }
    });
  });
}//updated ch9

function loadPhotos() {
	var rows = [];

	// creates or gets the global instance of photo collection
	var photos = Alloy.Collections.photo || Alloy.Collections.instance("Photo");

	// be sure we ignore profile photos;
	var where = {
		title : {
			"$exists" : true
		}
	};

	//this is a method in the model - from backbone.js
	photos.fetch({
		data : {
			order : '-created_at',
			where : where
		},
		success : function(model, response) {
			photos.each(function(photo) {
				var photoRow = Alloy.createController("feedRow", photo);
				rows.push(photoRow.getView());
			});
			$.feedTable.data = rows;
			Ti.API.info(JSON.stringify(data));
		},
		error : function(error) {
			alert('Error loading Feed ' + error.message);
			Ti.API.error(JSON.stringify(error));
		}
	});
}

//load photos on startup
$.initialize = function() {
  loadPhotos();
};		
	


