const express = require('express');
const fs = require('fs');

const app = express();

app.get('/',(req,res)=>{
    // fs.readFile('home.html',(err,data)=>{
    //     if(err) {
    //         res.status(500).send("Error reading file");
    //         return;
    //     }
    //     res.setHeader('Content-Type','text/html');
    //     res.send(data);
    // })
    res.sendFile(__dirname + '/home.html');
});

app.get('/about',(req,res)=>{
    // fs.readFile('about.html',(err,data)=>{
    //     if(err) {
    //         res.status(500).send("Error reading file");
    //         return;
    //     }
    //     res.setHeader('Content-Type','text/html');
    //     res.send(data);
    // })
    res.sendFile(__dirname + '/about.html');
});

app.get('/contact',(req,res)=>{
    res.sendFile(__dirname + '/contact.html');
});
app.get('/contact.css',(req,res)=>{
    res.sendFile(__dirname + '/contact.css');
});
app.get('/wall.jpg',(req,res)=>{
    res.sendFile(__dirname + '/wall.jpg');
});

app.listen(3000,(err)=>{
    if(err) console.log(err);
    console.log("Server is running on http://localhost:3000");
})