const http = require("http");
const fs = require("fs");
const url = require("url");
http.createServer((req,res)=>{
const parsedUrl = url.parse(req.url,true);
if(parsedUrl.pathname == "/" && req.method == "GET"){
    fs.readFile("./home1.html",(err,data)=>{
        if(err) {console.log("Error at reading home file"); return;}
        res.end(data);
    })

}else if(parsedUrl.pathname == "/login" && req.method == "GET"){
    fs.readFile("./login1.html",(err,data)=>{
        if(err){console.log("error at reading login file"); return;}
        res.end(data);
    })
}else if(parsedUrl.pathname == "/submit" ){

    fs.readFile("./userDetails.json",(err,data)=>{
        if(err) { console.log("error reading file userDetails.json"); return;}
        data = JSON.parse(data);
        const query = parsedUrl.query;
        // console.log(query.name,query.email);
        if(req.method == "GET"){
            for( user of data.users){
                let qName = query.name;
                let name = user.name;
                if(qName == name) {
                    res.write("<h1>Login Sucessful");
                    res.write(`<h2>Email ${query.email}</h2>`);
                    res.write(`<h2>Name ${query.name}`);
                    res.end();
                }
            }
            res.write("<h1>user not found</h1>");
            res.write(`<button onclick='location.href="/signup"'>Please Signup!!</button>`)
            res.end();
        }else if(req.method == "POST"){
            //query doent work for post use different technique (body param)
            data.users.push({name:query.name,email:query.email});
            fs.writeFile("./userDetails.json",JSON.stringify(data),(err)=>{
                if(err){console.log("Error at updating file:"); return;}
                res.write("<h1>Signup Sucessful</h1>");
                res.end(`<button onclick='location.href="/"'>Home</button>`)
            });
        }
    })
    
}else if(parsedUrl.pathname=="/signup" && req.method == "GET"){
    fs.readFile("./signup.html","utf-8",(err,data)=>{
        if(err){console.log("Error reading file signup1"); return;}
        res.end(data);
    })
}

}).listen(3000,(err)=>{
   if(err) console.log("Error listening at port"+3000);
   else console.log("Listening at port: ",3000);
})