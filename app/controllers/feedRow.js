var args = arguments[0] || {};

//this is setting the view elements of the row view
//based on the arguments passed into the contoller
$.image.image = model.attributes.urls.preview;
$.titleLabel.text = args.title || '';

//save the model id for use later in app
$.row_id = model.id || '';
