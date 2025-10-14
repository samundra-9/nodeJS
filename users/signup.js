function signup(name,email,password) {
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    let users = data.users;
    users = [...users, { name, email, password }];
    fs.writeFileSync('users.json', JSON.stringify({ users }), 'utf8');
    return { message: 'Signup successful' };

}

module.exports = { signup };