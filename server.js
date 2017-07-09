var express = require('express');

var bodyParser = require('body-parser');

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
	var matchedTodo;

	// Iterate over array; find the match
	// set matchedTodo to the foudn item
	todos.forEach(function (todo) {
		if (todoId === todo.id) {

				matchedTodo = todo;		
		}
	});

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
	var body = req.body;
	// add a field
	body.id = todoNextId;
	todoNextId++;

	// push onto the array
	todos.push(body);

	//console.log('description: ' + body.description);

	res.json(body);
});


app.listen(PORT, function () {
	console.log('Express Service Listening on port ' + PORT);
});
