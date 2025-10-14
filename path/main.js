const path = require('path');

// Get filename from a path
const filename = path.basename('/users/docs/file.txt');
console.log(filename);

// Get filename without extension
const filenameWithoutExt = path.basename('/users/docs/file.txt', '.txt');
console.log(filenameWithoutExt);
//In Node.js, __dirname and __filename are special variables available in CommonJS modules that provide the directory name and file name of the current module.

// Get the directory name of the current module
console.log('Directory name:', __dirname);

// Get the file name of the current module
console.log('File name:', __filename);

// Building paths relative to the current module
const configPath = path.join(__dirname, 'config', 'app-config.json');
console.log('Config file path:', configPath);

// Getting the directory name using path.dirname()
console.log('Directory using path.dirname():', path.dirname(__filename));

console.log("path via resolve:", path.resolve('config', 'app-config.json'));