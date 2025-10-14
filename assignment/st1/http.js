const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  if (pathname === "/") {
    fs.createReadStream("index.html").pipe(res);
  } else if (pathname === "/addproduct") {
    fs.createReadStream("form.html").pipe(res);
  } else if (pathname === "/submit") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const params = new URLSearchParams(body);
      const name = params.get("name");
      const price = params.get("price");
      const qty = params.get("qty");
      fs.readFile("products.json", (err, data) => {
        let products = [];
        if (!err) {
            products = JSON.parse(data).products;
            
        }
        products.push({ name, price, qty });
        fs.writeFile("products.json", JSON.stringify({ products }), err => {
          if (err) {
            res.writeHead(500);
            res.end("Error saving product");
          } else {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(`Product added: ${name}, ${price}, ${qty}`);
          }
        });
      });
    });
  } else if (pathname === "/all") {
    fs.createReadStream("products.json").pipe(res);
  } else if(pathname === "/show"){
    const query = parsedUrl.query;
    const price = query.price;
    fs.readFile("products.json", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error reading products");
      } else {
        const products = JSON.parse(data);
        const filteredProducts = products.filter(p => p.price >= price);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(filteredProducts));
      }
    });
  }else if(pathname === "/name"){
    const query = parsedUrl.query;
    const name = query.name;
    fs.readFile("products.json", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error reading products");
      } else {
        const products = JSON.parse(data);
        const filteredProducts = products.filter(p => p.name === name);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(filteredProducts));
      }
    });
  } else {
    res.writeHead(404);
    res.end("404 Page Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
