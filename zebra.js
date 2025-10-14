const { URL } = require("url");
const fs = require('fs');
const path = require('path');

const myUrl = new URL("https://example.com:8080/home.html?id=123&name=sam");
// console.log("use is", myUrl);
// console.log(myUrl.searchParams.keys());



// For binary data (like images), omit the encoding
fs.readFile('./express/wall.jpg', (err, data) => {
  if (err) throw err;
  // data is a Buffer containing the file content
  console.log('Image size:', data.length, 'bytes');
});

// Join path segments
const fullPath = path.join('/users', 'docs', 'file.txt');
console.log(fullPath); // Output depends on OS

// Handle relative paths and navigation
console.log(path.join('/users', '../system', './logs', 'file.txt'));

// Handle multiple slashes
console.log(path.join('users', '//docs', 'file.txt')); // Normalizes slashes

console.log(path.resolve('hello.txt'));
