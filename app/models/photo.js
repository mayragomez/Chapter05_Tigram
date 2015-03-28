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
			
			findMyPhotosAndWhoIFollow : function(_user, _options) {
				var collection = this;

				// get all of the current users friends
				_user.getFriends(function(_resp) {
					if (_resp.success) {

						// pluck the user ids and add current users id
						var idList = _.pluck(_resp.collection.models, "id");
						idList.push(_user.id);

						// set up where parameters using the user list
						var where_params = {
							"user_id" : {
								"$in" : idList
							},
							title : {
								"$exists" : true
							}
						};
						// set the where params on the query
						_options.data = _options.data || {};
						_options.data.order = '-created_at';
						_options.data.per_page = 25;
						_options.data.where = JSON.stringify(where_params);

						// execute the query
						collection.fetch(_options);
					} else {
						Ti.API.error('Error fetching friends');
						_options.error();
					}
				});
			},

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