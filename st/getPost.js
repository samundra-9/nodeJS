// import math custom models and perform calculation via get for circle and square anddd post for rectangle

const http = require('http');
const fs = require('fs');

const url = require('url') // for get
const querystring = require('querystring') //for post

const {circle,square,rectangle} = require('./getPostArea.js');

const server = http.createServer((req,res)=>{
    const parsedUrl = url.parse(req.url,true);
    const pathname = parsedUrl.pathname;

    if(req.method == 'GET' && pathname == '/circle'){
        const {radius} = parsedUrl.query;
        let area = circle(radius);
        res.end(JSON.stringify({"area of circle is": area}));
    }
    else if(req.method == 'GET' && pathname == '/square'){
        const {side} = parsedUrl.query;
        let area = square(side);
        res.end(JSON.stringify({"area of square is: ":area}));
    }
    else if(req.method == 'POST' && pathname == '/rectangle'){
        let body ='';
        req.on('data',(chunk)=>{
            body += chunk.toString();
        })
        req.on('end',()=>{
            const {length, width} = querystring.parse(body);
            let area = rectangle(length,width);
            res.end(JSON.stringify({"area of rectangle is: ":area}));
        })
    }
})

server.listen(3000,(err)=>{
    if(!err) console.log("Running at port 3000");
});