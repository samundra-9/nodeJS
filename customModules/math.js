// This file contains math functions

// These functions are private (only available in this file)
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
export const subtract = (a, b) => a - b; //ejs style



// module.exports = "Here's what other files can use"
module.exports = {
  add: add,
  multiply: multiply,
  // You can also write just: add, multiply (shortcut)
};