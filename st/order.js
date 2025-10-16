// order.js
const fs = require('fs');

fs.readFile('order.json','utf8',(err,data)=>{
    if(err){
        console.log("error reading order.json file");
        return;
    }
    data = JSON.parse(data).items;
    let filteredItems = [];
    data.forEach(item=>{
        if(item.total > 700){
            item.status ="approved";
            filteredItems.push(item);
        }
    })
    fs.writeFile('approved.json',JSON.stringify({filteredItems}),(err)=>{
        if(err) {
            console.log("Error writing approved.json");
            return;
        }
        console.log("Items added to approved.json sucessfully");
        
    })
})