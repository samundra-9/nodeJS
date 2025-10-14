const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

const server = http.createServer((req, res) => {
    if(req.method === 'GET' && req.url === '/form') {
        fs.readFile("./form.html","utf-8",(err,data)=>{
            if(err){
                res.writeHead(500, {'Content-Type': 'text/plain'}); 
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/form') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const formData = parse(body);
            console.log(formData);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Form submitted successfully');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
