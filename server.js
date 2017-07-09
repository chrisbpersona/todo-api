var express = require('express');

var app = express();

var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Reading work',
	completed: false
}, {
	id: 2, 
	description: 'Get to office',
	completed: false
}, {
	id: 3,
	description: 'Go Home',
	completed: true
}];

app.get('/', function(req, res) {
	res.send('TODO API Root');
});

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

app.listen(PORT, function () {
	console.log('Express Service Listening on port ' + PORT);
});
