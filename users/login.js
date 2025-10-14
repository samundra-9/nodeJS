const fs = require('fs');
function login(email, password) {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading user data:', err);
            return;
        }
        const users = JSON.parse(data).users;
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            console.log('Login successful:', user);
            return true;
        } else {
            console.log('Invalid email or password');
            console.log("Please Sign up if you don't have an account.");
            return false;
        }
    });
}
   
module.exports = { login };