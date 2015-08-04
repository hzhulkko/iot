module.exports = function(mongoose) {
	var ObjectId = mongoose.Schema.Types.ObjectId;

	var measurementSchema = mongoose.Schema({
	    main_unit_id: {type: ObjectId, required: true},
	    temperature: {type: Number, default: 0},
	    humidity: {type: Number, default: 0},
	    water_level: {type: Number, default: 0},
		nutrient_level: {type: Number, default: 0},   
	    light: {type: Number, default: 0},
	    created_at: { type: Date, default: Date.now }
	});

	var mainunitSchema = mongoose.Schema({
		//configuration_id: {type: ObjectId, required: true},
		description: String,
		location: String,
		created_at: { type: Date, default: Date.now }
	});

	var configurationSchema = mongoose.Schema({
		name: String,
		flow_amount: Number,
		solution_percent: Number,
		warning_difference_in_temperature: Number,
		warning_difference_in_humidity: Number,
		warning_water_minimum_level: Number,
		warning_nutrient_minimum_level: Number,
		created_at: { type: Date, default: Date.now }
	});

    var models = {
      Measurements : mongoose.model('Measurement', measurementSchema),
      Mainunit : mongoose.model('Mainunit', mainunitSchema),
      Configuration : mongoose.model('Configuration', configurationSchema)
    };

    return models;
}