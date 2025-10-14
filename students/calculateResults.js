function calculateResults() {
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('students.json', 'utf8'));
    let students = data.students;

    students = students.map(student => {
        const total = student.marks.reduce((acc, mark) => acc + mark, 0);
        const average = total / student.marks.length;
        return {
            ...student,
            average,
            status: average >= 50 ? 'Pass' : 'Fail'
        };
    });
    fs.writeFileSync('students.json', JSON.stringify({ students }), 'utf8');
}

module.exports = { calculateResults };