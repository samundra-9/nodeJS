// Import our math module
// './math.js' = look for math.js in same folder
const mathTools = require('./math.js');
import { subtract } from './math.js'; // Importing the named export ejs style
// Now we can use the exported functions
console.log('5 + 3 =', mathTools.add(5, 3));
console.log('5 × 3 =', mathTools.multiply(5, 3));

// console.log("5 - 3= ", subtract(5, 3));



