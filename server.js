// Express web service
var express = require('express');
// Body-parser handles POST methods
var bodyParser = require('body-parser');
// Underscore api handling functions
var _ = require('underscore');
// DB setup go fire up the persistence
var db = require('./db.js');


var app = express();

var PORT = process.env.PORT || 3000;

var todos = [];

var todoNextId = 1;
// Setup middleware for body parser
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('API Root');
});

/*// GET /todos?completed=true
app.get('/todos', function (req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	res.json(filteredTodos);
});
*/
// GET /todos?completed=false&q=work
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({where: where}).then(function (todos) {
		res.json(todos);
	}, function (e) {
		res.status(500).send();
	});
});


	// var filteredTodos = todos;

	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: true
	// 	});
	// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: false
	// 	});
	// }

	// if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
	// 	});
	// }

	// res.json(filteredTodos);
//  });

// GET request for API
// /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

// use with db
// 

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});

// end use db
// 

	// search the array using underscore
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matchedTodo) {

	// 	res.json(matchedTodo);
	// } else {
	// 	// If matchedTodo is not defined return
	// 	res.status(404).send();
	// }

});

// POST request for API body-parser lib used for this
// /todos
app.post('/todos', function(req, res) {
	// Underscore pick to control accepted data from the body
	var body = _.pick(req.body, 'description', 'completed');

	// use the db
	// call create on db.todo
	//respond to the api caller with 200 and value of todo object
	// else pass e to res.status(400).JSON(e)

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	})

	// end use the db
	// 
	// Underscore pick to control accepted data from the body
	// var body = _.pick(req.body, 'description', 'completed');

	// // Underscore control the data validation
	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// };

	// // set body.description to be trimmed value to remove white spaces forward and trailing
	// body.description = body.description.trim();

	// // add a field
	// body.id = todoNextId;
	// todoNextId++;

	// // push onto the array
	// todos.push(body);

	// res.json(body);
});

// DELETE API by /todos/:id 
// 
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function (rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: "No record with id"
			});
		} else {
			res.status(204).send();
		}
	}, function () {
		res.status(500).send();
	});


	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (!matchedTodo) {
	// 	res.status(404).json("Error, no id found");
	// } else {
	// 	todos = _.without(todos, matchedTodo);
	// 	res.json(matchedTodo);
	// }
});

// UPDATE API by todos/:id
// 
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	// Validation on data to be updated
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		// data was bad so handle it
		return res.status(400).send();

	} else {
		// never provided attributed, no issue

	}
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;

	} else if (body.hasOwnProperty('description')) {
		// data was bad so handle it
		return res.status(400).send();

	} else {
		// never provided attributed, no issue

	}

	// Update using underscore extend ( passing by reference will update )
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express Service Listening on port ' + PORT);
	});


});