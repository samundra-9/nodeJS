const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res)=>{

    if(req.method == 'GET' && req.url == '/'){
        fs.readFile("./index.html",(err,data)=>{
            if(!err) res.end(data);
        })
    }
    else if(req.method == 'GET' && req.url == '/about'){
        res.end("<h1>Welcome to About page</h1>");
    }
    else if(req.method == 'GET' && req.url == '/contact'){
        res.end("<h1>I am busy yrr</h1>");
    }
    else if(req.method == 'GET' && req.url == "/wall.jpg"){
        fs.readFile("./wall.jpg",(err,data)=>{
            if(!err) res.end(data);
        })
    }else if(req.method == 'GET' && req.url == '/main.css'){
        fs.readFile("./main.css",(err,data)=>{
            if(!err) res.end(data);
        })
    }
})

server.listen(3000,()=>{
    console.log("listening at port 3000");
})