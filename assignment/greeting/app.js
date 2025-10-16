let hello = require('./greeting').hello;
let goodbye = require('./greeting').goodbye;
let add = require('./greeting').add;
let counter = require('./greeting').counter;
hello("Alice");
goodbye("Alice");
console.log("2 + 3 =", add(2, 3));
console.log("2 + 3 =", add(2, 3));
console.log("Counter value:", counter);