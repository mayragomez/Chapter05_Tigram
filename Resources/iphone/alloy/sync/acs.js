function S4() {
    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
}

function guid() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
    Cloud = require("ti.cloud");
    Cloud.debug = !0;
    config.Cloud = Cloud;
}

function Sync(method, model, options) {
    var object_name = model.config.adapter.collection_name;
    "photos" === object_name ? processACSPhotos(model, method, options) : "users" === object_name && processACSUsers(model, method, options);
}

function processACSPhotos(model, method, options) {
    switch (method) {
      case "create":
        Cloud.Photos.create(model.toJSON(), function(e) {
            if (e.success) {
                model.meta = e.meta;
                options.success(e.photos[0]);
                model.trigger("fetch");
            } else {
                Ti.API.error("Photos.create " + e.message);
                options.error(e.error && e.message || e);
            }
        });
        break;

      case "read":
        model.id && (options.data.photo_id = model.id);
        var method = model.id ? Cloud.Photos.show : Cloud.Photos.query;
        method(options.data || {}, function(e) {
            if (e.success) {
                model.meta = e.meta;
                options.success(1 === e.photos.length ? e.photos[0] : e.photos);
                model.trigger("fetch");
                return;
            }
            Ti.API.error("Cloud.Photos.query " + e.message);
            options.error(e.error && e.message || e);
        });
        break;

      case "update":
      case "delete":
        alert("Not Implemented Yet");
    }
}

var _ = require("alloy/underscore")._;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
    config = config || {};
    config.data = {};
    InitAdapter(config);
    return config;
};

module.exports.afterModelCreate = function(Model) {
    Model = Model || {};
    Model.prototype.config.Model = Model;
    return Model;
};