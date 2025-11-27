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
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.get('/',(req,res)=>{
    // dbinstance.collection('User').findOne({})
    // .then(data=>{
    //     console.log("Data: ",data);
    // })
    // .catch(err=>{
    //     console.log("Error reading data: ",err);
            // res.send("Failed reading data");
    // })
    // res.send({ok:true})
    dbinstance.collection('User').find({})
    .toArray()
    .then(data=>{
        // console.log("Data: ",data);
        res.render('home',{users:data})
    })
    .catch(err=>{
        console.log("Error reading data: ",err);
        res.send("Failed reading data");
    })
    
});
app.get("/insertone",(req,res)=>{
    dbinstance.collection("User").insertOne({name:"xtrem",roll:"1234",sec:"I"})
    .then(data=>console.log("Data Inserted: ",data))
    .catch(err=>{
        console.log("Error insrting data: ",err)
        res.send("Please try again");
    })
    res.redirect('/')
});
app.get("/insertmany",(req,res)=>{
    dbinstance.collection("User").insertMany([{name:"xtrem",roll:"1234",sec:"I"},{name:"bull",roll:"12",sec:"I"}])
    .then(data=>console.log("Data Inserted: ",data))
    .catch(err=>{
        console.log("Error insrting data: ",err)
        res.send("Please try again");
    })
    res.redirect('/');
});
app.get('/delete/:id',(req,res)=>{
    dbinstance.collection("User").deleteOne({_id:new mongodb.ObjectId(req.params.id)})
    .then(data=>console.log("Data deleted: ",data))
    .catch(err=>{
        console.log("Error deleting data: ",err)
        res.send("Please try again");
    })
    res.redirect('/');
})
app.get('/update/:id',(req,res)=>{
   dbinstance.collection("User").findOne({_id: new mongodb.ObjectId(req.params.id)})
   .then(userData=>{
        // console.log(userData);
        res.render('form',{user:userData});
   })
   .catch(err=>res.status(500).send("Someting went wrong try again"));
})
app.post('/update/:id',(req,res)=>{
    dbinstance.collection("User").updateOne({_id: new mongodb.ObjectId(req.params.id)},{$set:{name:req.body.name,roll:req.body.roll, sec: req.body.sec}})
   .then(userData=>{
        // console.log(userData);
        res.redirect("/");
   })
   .catch(err=>res.status(500).send("Someting went wrong try again"));
})
app.listen(3000)
