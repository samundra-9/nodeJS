// fs = File System module - built into Node.js
// require('fs') = "Please give me the file system tools"
const fs = require('fs');
const path = require('path');

// fs.writeFileSync() = Create a file with content
// Why "Sync"? It means "Synchronous" - program waits until file is written
fs.writeFileSync('test.txt', 'Hello from Node.js!');

// fs.readFileSync() = Read file content
// 'utf8' = read as text (not binary)
const content = fs.readFileSync('test.txt', 'utf8');
console.log('File content:', content);

// path.join() = safely combine folder paths
// Why needed? Windows uses \, Mac/Linux use / - path.join() handles both
const filePath = path.join('folder', 'subfolder', 'file.txt');
console.log('Safe path:', filePath);