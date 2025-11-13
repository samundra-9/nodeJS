const express = require('express');
const path = require('path')
const jwt = require('jsonwebtoken');
const app = express();
const cookie_parser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(cookie_parser());

const users = {
        id : 2,
        role : "admin",
        name : "whois"
    };

function validateToken(req,res,next){
    try{
    const token = req.cookies.token;
    console.log(token);
    let data = jwt.verify(token,"itsSecret");
    console.log(data);
    if(data){
        req.token = req.cookies.token;
        next()
    }
}
catch(err){
    res.send("something went wrong",err)
}
    
}
app.get('/',(req,res)=>{
    res.send('<a href="/login">Login</a>');
})
app.get('/login',(req,res)=>{
    res.sendFile(__dirname + '/login.html')
})
app.post('/login',(req,res)=>{
    const {username,password} = req.body;
    if(username !== users.name) res.send("Credentials didnot match")

    const token = jwt.sign({id:users.id},"itsSecret",{expiresIn:'1h'});
    res.cookie("token",token);
    res.redirect('/dashboard');
})
app.get('/dashboard',validateToken,(req,res)=>{
    res.send(`welcome to dashboard your token is :`)
})
app.listen(3000);