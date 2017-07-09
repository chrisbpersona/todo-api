// Express web service
var express = require('express');
// Body-parser handles POST methods
var bodyParser = require('body-parser');
// Underscore api handling functions
var _ = require('underscore');

var app = express();

var PORT = process.env.PORT || 3000;

var todos = [];

var todoNextId = 1;
// Setup middleware for body parser
app.use(bodyParser.json());


// GET request for API
//  /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});

// GET request for API
// /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	// search the array using underscore
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		
		res.json(matchedTodo);
	} else {
	// If matchedTodo is not defined return
	res.status(404).send();		
	}
	
});

// POST request for API body-parser lib used for this
// /todos
app.post('/todos', function(req, res) {
	// Underscore pick to control accepted data from the body
	var body = _.pick(req.body, 'description', 'completed');

	// Underscore control the data validation
	if (!_.isBoolean(body.completed) || !_.isString(body.description) 
		|| body.description.trim().length === 0) {
		return res.status(400).send();
	};

	// set body.description to be trimmed value to remove white spaces forward and trailing
	body.description = body.description.trim();

	// add a field
	body.id = todoNextId;
	todoNextId++;

	// push onto the array
	todos.push(body);

	res.json(body);
});

// DELETE API by /todos/:id 
// 
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json("Error, no id found");
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});


app.listen(PORT, function () {
	console.log('Express Service Listening on port ' + PORT);
});
