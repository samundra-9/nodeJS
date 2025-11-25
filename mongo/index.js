const express = require('express');
const mongodb = require('mongodb');
const app = express();

const client  = mongodb.MongoClient;
let dbinstance;
client.connect("mongodb://127.0.0.1:27017")
.then(db=>{
    dbinstance = db.db("secI");
    console.log("connected");                                        
})
.catch((err) => console.error("Mongo connect error:", err));
app.get('/',(req,res)=>res.json({ok:"connected"}));
app.get("/insertone",(req,res)=>{
    dbinstance.collection("User").insertOne({name:"xtrem",roll:"1234",sec:"I"})
    .then(data=>console.log("Data Inserted: ",data))
    .catch(err=>{
        console.log("Error insrting data: ",err)
        res.send("Please try again");
    })
    res.json({ok:true});
});
app.get("/insertmany",(req,res)=>{
    dbinstance.collection("User").insertMany([{name:"xtrem",roll:"1234",sec:"I"},{name:"bull",roll:"12",sec:"I"}])
    .then(data=>console.log("Data Inserted: ",data))
    .catch(err=>{
        console.log("Error insrting data: ",err)
        res.send("Please try again");
    })
    res.json({ok:true});
});
app.listen(3000);
