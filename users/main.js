const fs = require('fs');
const { login } = require('./login');
const { signup } = require('./signup');

if(!login("sam","123456")){
    console.log("Would you like to sign up?");
    console.log(signup("sam","sam@gmail.com","123456"));
}