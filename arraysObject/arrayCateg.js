// write your JS code here
const products = [
   { name: 'Pen', categories: ['stationery', 'writing'] },
   { name: 'Laptop', categories: ['electronics', 'computers'] },
   { name: 'Chair', categories: [] },
   { name: 'Water Bottle', categories: ['kitchen', 'storage'] }
];

function getCategories(productName){
    let arr = [];
    products.forEach(product=>{
        if(product.name === productName ){
            arr = product.categories;
        }
    });
    let message = productName + ": "
    if(arr.length == 0) message += "No Categories";
    else message += arr.join(",");
    return message;
}
console.log(getCategories("Pen"));
console.log(getCategories("Chair"));
console.log(getCategories("Water Bottle"));