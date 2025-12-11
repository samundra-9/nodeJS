const express = require('express');
const app = express();
let students= []
app.get('/', (req, res) => {
    res.send('Welcome to the Student Registration Portal');
});
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/form.html');
});
app.post('/register', (req, res) => {
    const {name, age, city, course, marks} = req.body;
    students.push({name, age, city, course, marks});
    res.json({message: 'Student registered successfully', student: {name, age, city, course, marks}});

});
app.listen(3000, () => { console.log('Registration server running on port 3000'); });
