// NOTICE! Use through extensions parameter in crud.js

module.exports = function(app, name, model, pathPrefix) {
	app.get(pathPrefix + 'averages/', function(request, response) {
		model.aggregate([
			{
				$group: { 
					_id: "$main_unit_id",
					humidity: { $avg: "$humidity" },
					temperature: { $avg: "$temperature"},
					light: { $avg: "$light"},
					water_level: { $avg: "$water_level"},
					nutrient_level: { $avg: "$nutrient_level"}				
				}
			},
			{ $sort: { _id: 1} }
		], function(err, result) {
			response.send(result);
		});
	});

	app.get(pathPrefix + 'latest/:main_unit_id/:count', function(request, response) {
		model.find({main_unit_id: request.params.main_unit_id}, {}, {sort: { 'created_at': -1}, limit: request.params.count}, function(err, result) {
			console.log(result);
			response.send(result);
		});
	});

	app.get(pathPrefix + 'latest/', function(request, response) {
		model.aggregate([
			{ $sort: { created_at: 1 }},
			{
				$group: { 
					_id: "$main_unit_id",
					humidity: { $last: "$humidity" },
					temperature: { $last: "$temperature"},
					light: { $last: "$light"},
					water_level: { $last: "$water_level"},
					nutrient_level: { $last: "$nutrient_level"}
				}
			},
			{ $sort: { _id: 1} }
		], function(err, result) {
			response.send(result);
		});
	});


}