const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/calculator") {
    // fs.readFile("./index.html", "utf-8", (err, data) => {
    //   if (err) { 
    //     res.writeHead(500, { "Content-Type": "text/plain" });
    //     res.end("Internal Server Error");
    //     return;
    //   }
    //   res.writeHead(200, { "Content-Type": "text/html" });
    //   res.end(data);
    // });
    fs.createReadStream("./index.html").pipe(res);
  } else if (req.method == "GET" && req.url.startsWith("/calculate")) {
    const parsedUrl = url.parse(req.url, true);
    // const query = parsedUrl.query;
    // const num1 = parseFloat(query.num1);
    // const num2 = parseFloat(query.num2);
    // const operation = query.operation;
    
    const {num1, num2, operation} = parsedUrl.query;

    let result;
    switch (operation) {
      case "add":
        result = num1 + num2;
        break;
      case "subtract":
        result = num1 - num2;
        break;
      case "multiply":
        result = num1 * num2;
        break;
      case "divide":
        result = num2 !== 0 ? num1 / num2 : "Division by zero error";
        break;
      default:
        result = "Invalid operation";
    }

    // res.writeHead(200, { 'Content-Type': 'text/plain' });
    // res.end(`Result: ${result}`);
    res.write(`<h1>Result: ${result}</h1>`);
    res.end("<button><a href='/calculator'>Go to Calculator</a></button>");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
