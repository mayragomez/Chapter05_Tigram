var Alloy = require('alloy'),
    _ = require("alloy/underscore")._,
	model, collection;

exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "friends"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};

model = Alloy.M('friends',
	exports.definition,
	[]
);

collection = Alloy.C('friends',
	exports.definition,
	model
);

exports.Model = model;
exports.Collection = collection;
