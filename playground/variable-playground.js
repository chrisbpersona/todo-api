var person = {
	name: 'Chris',
	age: 30
};

function updatePerson (obj) {
	// obj = {
	// 	name: 'Chris',
	// 	age: 41
	// };
	obj.age = 41;
}

updatePerson(person);
console.log(person);



// Array Example

var grades = [20, 30];

function addGrades (gradesArray) {
	//gradesArr.push(55);

	gradesArray.grades = [20, 54,99];
}

addGrades(grades);
console.log(grades);