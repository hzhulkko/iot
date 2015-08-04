var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var models = require('./models')(mongoose);

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test'; 
mongoose.connect(mongoUri);

app.set('port', (process.env.PORT || 5000));
app.use(allowCrossDomain);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(authenticateUser);

// Custom middlewares
function authenticateUser(req, res, next) {
	// TODO: Authetication middleware
	console.log("AUTHENTICATING...");
	next();
}

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

// Routes
require('./routes/crud')(app, 'module', models.Modules);
require('./routes/crud')(app, 'mainunit', models.Mainunit);
require('./routes/crud')(app, 'measurement', models.Measurements, [require('./routes/crud_extension')]);


app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

