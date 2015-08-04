module.exports = function(app, name, model, extensions) {
	var pathPrefix = '/' + name + '/';

	// Run extensions before adding main routes
	if (extensions) {
		extensions.forEach(function(fn) {
			fn(app, name, model, pathPrefix);
		});
	}

	app.post(pathPrefix, function(request, response) {
		var mod = new model(request.body);
		mod.save(handleRequest(response));
	});

	app.get(pathPrefix, function(request, response) {
		model.find({}, showDataOrError(response));
	});

	app.get(pathPrefix + ':id', function(request, response) {
		model.findById(request.params.id, showDataOrError(response));
	});

	app.get(pathPrefix + 'last/:id/:count', function(request, response) {
		model.findById(request.params.id, {}, { sort: { 'created_at' : -1 }, limit: request.params.count }, function(err, data) {
			response.send(data);
		});
	});

	app.put(pathPrefix + ':id', function(request, response) {
		model.findById(request.params.id, function(err, data) {			
			for (var key in request.body) data[key] = request.body[key];

			data.save(function(err) {
				if (err) {
					response.send("Not updated: " + err);
				}
				else {
					response.send("Updated");
				}
			});
		});
	});

	function showDataOrError(response) {
		return function(err, data) {
			if (err || !data) {
				response.send("Error: " + err);
			}
			else {
				response.send(data);
			}
		}
	}

	function handleRequest(response) {
		return function(err, result) {
			if (err) {
				response.send('Could not save data: ' + err);
			}
			else {
				response.send(result);
			}
		}
	}
}