const http = require("http");
const fs = require("fs");
const url = require("url");
http
  .createServer((req, res) => {
    // console.log("Request made");
    let parsedUrl = url.parse(req.url, true);
    // console.log(parsedUrl);
    if (parsedUrl.pathname == "/submit") {
        let query = parsedUrl.query;
      
      // console.log(query);
      // res.write("<h1>Form Submitted</h1>");
      // res.write("<h2>Name: "+query.name+"</h2>");
      // res.write("<h2>Email: "+query.email+"</h2>");
      // res.end();
      fs.readFile("./userDetails.json", (err, data) => {
        if (err) {
          res.end("<h1>Error loading page</h1>");
          return;
        }
        data = JSON.parse(data);
        if (req.method === "GET") {
        for (user in data.users) {
          if (data.users[user].email === query.email) {
            res.end(
              "<h1>User Found</h1><h2>Name: " +
                data.users[user].name +
                "</h2><h2>Email: " +
                data.users[user].email +
                "</h2>"
            );
            return;
          }
        }
    
        res.write("<h1>User Not Found</h1>");
        res.write(
          `<button onclick="location.href='/signup'">please sign up</button>`
        );
        res.end();
        return;
    }
    else{
        //add data to json file
        data.users.push({"name":query.name, "email":query.email});
        console.log(query.name + " " + query.email);
        fs.writeFile("./userDetails.json", JSON.stringify(data), (err) => {
            if (err) {
              res.end("<h1>Error loading page</h1>");
              return;
            } else {
              res.end("<h1>Sign Up Successful</h1>");
              return;
            }
          });

    }
      });
      return;
    } else if (parsedUrl.pathname == "/signup" && req.method === "GET") {
      fs.readFile("./signup.html", (err, data) => {
        if (err) {
          res.end("<h1>Error loading page</h1>");
          return;
        } else {
          res.end(data);
          return;
        }
      });
    } else if (req.url === "/" && req.method === "GET") {
      res.end("<h1>Root Page</h1>");
    } else if (req.url === "/about" && req.method === "GET") {
      fs.readFile("./about.html", (err, data) => {
        if (err) {
          res.end("<h1>Error loading page</h1>");
          return;
        } else {
          res.end(data);
          return;
        }
      });
      // res.end('<h1>About Page</h1>');
    } else if (req.url === "/home" && req.method === "GET") {
      fs.readFile("./home.html", (err, data) => {
        if (err) {
          res.end("<h1>Error loading page</h1>");
          return;
        } else {
          res.end(data);
          return;
        }
      });
      // res.end("<h1>Home Page</h1>");
    } else if (req.url === "/contact" && req.method === "GET") {
      fs.readFile("./contact.html", (err, data) => {
        if (err) {
          res.end("<h1>Error loading page</h1>");
          return;
        } else {
          res.end(data);
          return;
        }
      });
      // res.end("<h1>Contact Page</h1>");
    } else if (req.url === "/home.css" && req.method === "GET") {
      fs.readFile("./home.css", (err, data) => {
        if (err) {
          res.end("<h1>Error loading page</h1>");
          return;
        } else {
          res.end(data);
          return;
        }
      });
    } else if (req.url === "/home.js" && req.method === "GET") {
      fs.readFile("./home.js", (err, data) => {
        if (err) {
          res.end("<h1>Error loading page</h1>");
          return;
        } else {
          res.end(data);
          return;
        }
      });
    } else if (req.url === "/wall.jpg" && req.method === "GET") {
      fs.readFile("./wall.jpg", (err, data) => {
        if (err) {
          res.end("<h1>Error loading page</h1>");
          return;
        } else {
          res.end(data);
          return;
        }
      });
    } else {
      res.end("<h1>404 Page Not Found</h1>");
    }
  })
  .listen(3000, (err) => {
    if (err) console.log(err);
    console.log("Server is listening on port 3000");
  });
