const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/sessionDB')
.then(()=>{
    console.log("Connected to MongoDB for session management");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String
});
const User = mongoose.model('User',userSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    saveUninitialized : true,
    resave : false,
    secret :" hey1234"
}));

function isAuthenticated(req, res, next) {
    if (req.session && req.session.username) {
        return next();  
    } else {
        res.redirect('/login'); 
    }
}

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/home.html');
});

app.get('/dashboard', isAuthenticated,(req,res)=>{
    res.send(`Welcome to your dashboard, ${req.session.username}`);
});

app.get('/login',(req,res)=>{
    res.sendFile(__dirname + '/login.html');
}
);

app.post('/login',(req,res)=>{
    const { username,email, password } = req.body;
    const user = User.findOne({username: username,email: email, password: password })
    user.then((foundUser)=>{
        if(foundUser){
            req.session.username = foundUser.username;
            res.redirect('/dashboard');
        } else {
            res.send("<h1>Invalid credentials. Please try again. or <a href='/signup'>sign up</a></h1>");
        }
    });
});
app.get('/signup',(req,res)=>{
    res.sendFile(__dirname + '/signup.html');
});
app.post('/signup',async (req,res)=>{
    const { username, email, password } = req.body;
    const validUser = await User.findOne({ email: email });
    if(validUser){
        return  res.send("<h1>Username or Email already exists. Please <a href='/signup'>try again</a></h1>");
    }
    const newUser = await  User.create({ username, email, password });
    if(newUser){
        res.send("<h1>Signup successful. Please <a href='/login'>login</a></h1>");
    } else {
        res.send("<h1>Signup failed. Please try again.</h1>");
    }
});

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.send("Error logging out");
        }
        res.redirect('/');
    });
});

app.listen(4000, ()=>{
    console.log("Session app is running on port 4000");
});