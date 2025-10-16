function hello(name) {
    console.log("Hello, " + name + "!");
}

function goodbye(name) {
    console.log("Goodbye, " + name + "!");
}

let counter = 0;
function add(a, b) {
    return ++counter;
    
}

module.exports = { hello, goodbye, add, counter };