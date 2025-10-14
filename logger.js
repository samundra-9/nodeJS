
let credentials = [{email: "sam@gmail.com", password: "yoPassword"}, {email: "john@gmail.com", password: "johnPassword"}];
let readline = require('readline');
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
}); 
function login(email, password){
    let user = credentials.find(user => user.email === email && user.password === password);
    if(user){
        console.log("Login Successful");
    }else{
        console.log("Login Failed");
        rl.question("Do you want to signup? (yes/no): ", function(answer) {
            if(answer.toLowerCase() === 'yes'){
                rl.question("Enter your email: ", function(newEmail) {
                    rl.question("Enter your password: ", function(newPassword) {
                        signup(newEmail, newPassword);
                        rl.close();
                    });
                });
            }else{
                rl.close();
            }
        }); 
    }
}
function signup(email, password) {
    if(credentials.find(user => user.email === email)){
        console.log("Email already exists");
    }else{  
        credentials.push({email: email, password: password});
        console.log("Account created successfully!");
    }
}

login("sam@yahoo.com","noPassword");