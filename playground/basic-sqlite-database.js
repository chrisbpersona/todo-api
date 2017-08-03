// Datalayer ORM provider for SQL persistence layers
var Sequelize = require('sequelize');

// Init sqlite persistence 
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
}); 

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})
// sequelize.sync({force:true}).then( function () {
sequelize.sync({}).then( function () {
	console.log('All synched');

	Todo.findById(2).then(function (todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('Todo not found');
		}
	});
});
// 	Todo.create({
// 		description: 'Trebek',
// 		completed: false
// 	}).then(function (todo) {
// 		return Todo.create({
// 			description: 'Picard'
// 		});
// 	}).then(function() {
// 		//return Todo.findById(1)
// 		return Todo.findAll({
// 			where: {
// 				description: {
// 					$like: '%Picard%'
// 				}
// 			}
// 		});
// 	}).then(function (todos) {
// 		if (todos) { 
// 			todos.forEach(function(todo) {
// 				console.log(todo.toJSON());
// 			});			
// 		} else {
// 			console.log('No Todo found');
// 		}
// 	}).catch(function (e) {
// 		console.log(e);
// 	});
// });