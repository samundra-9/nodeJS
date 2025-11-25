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
app.get("/insert",(req,res)=>{
    
})
app.listen(3000);
