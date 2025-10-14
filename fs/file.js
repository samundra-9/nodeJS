const fs = require('fs');
// console.log("File System module loaded:", fs );
fs.writeFileSync('hello.txt', 'Hello from Node.js!');
fs.appendFileSync('hello.txt', '\nAppended text.');
const content = fs.readFileSync('hello.txt', 'utf-8');
console.log('File content:', content);
fs.writeFile('goodbye.txt', 'Goodbye from Node.js!', (err) => {
    if (err) throw err;
    console.log('goodbye.txt has been created.');
});
fs.readFile('goodbye.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log('goodbye.txt content:', data);
});
fs.appendFile('goodbye.txt', '\nAppended goodbye text.', (err) => {
    if (err) throw err;
    console.log('goodbye.txt has been updated.');
});
fs.writeFile("newFile.json", JSON.stringify({ name: "John", age: 30 }), (err) => {
    if (err) throw err;
    console.log("newFile.json has been created.");  
});
fs.appendFile("newFile.json", "\nAdditional JSON data.", (err) => {
    if (err) throw err;
    console.log("newFile.json has been updated.");
});
fs.readFile("newFile.json", "utf-8", (err, data) => {
    if (err) throw err;
    console.log("newFile.json content:", data);
});
try{
if(fs.existsSync("temp.txt")){
    fs.unlinkSync("temp.txt");
    console.log("temp.txt has been deleted.");
}else{
    console.log("temp.txt does not exist.");
}
}catch(err){
    console.error("Error checking or deleting temp.txt:", err);
}
fs.unlink("sam.txt", (err) => {
    if (err) {
        console.log("Error deleting sam.txt") ;
        //  throw err;
        }
    console.log("sam.txt has been deleted.");
});