const fs = require('fs');
let products = [];
fs.readFile('products.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading products.txt:', err);
        return;
    }   
    products = data.split('\n');
    products = [...new Set(products)];
    products.forEach((product, index) => {
        fs.appendFile('unique_products.txt', product + '\n', (err) => {
            if (err) {
                console.error('Error appending to unique_products.txt:', err);
            } else {
                console.log(`Appended product ${index + 1}: ${product}`);
            }
        });
    });
});

