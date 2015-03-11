exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "photos"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});
		//end extend 
		return Model;
	},
	
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});
		//end extend
		return Collection;
	}
};