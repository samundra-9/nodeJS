
const fs = require('fs');
const { calculateResults } = require('./calculateResults');

calculateResults();



fs.readFile('students.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading student data:', err);
        return;
    }
    const students = JSON.parse(data).students;
    students.forEach(student => {
        let message = `Name: ${student.name}, Marks: ${student.marks.join(', ')}`;

        fs.appendFile('name.txt', `${student.name}\n`, (err) => {
            if (err) {
                console.error('Error saving name data:', err);
            }
        });
        if (student.average !== undefined) {
            message += `, Average: ${student.average}, Status: ${student.status}`;
        }
        console.log(message);
    });

});