const express = require('express');
const mongodb = require('mongodb');
const session = require('express-session');
const app = express();

const client = mongodb.MongoClient;
let dbinstance;

client.connect("mongodb://127.0.0.1:27017")
.then(db=>{
    dbinstance = db.db('ecom');
    console.log("db connected");
})
.catch(err=> console.log("Error connecting to DB",err));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.use(session({
  saveUninitialized:false,
  resave:false,
  secret:"keepItSecret"
}));

function authenciate(req,res,next){
    if(req.session.user) next();
    else res.render('login',{msg:"login first"});
}
function authorize(req,res,next){
    if(req.session.user && req.session.user.role === 'admin') next();
    else res.send("Access denied ..Unauthorized access");
}

app.get('/',(req,res)=>{
    if(req.session.user) res.redirect('/dashboard');
    else res.render('login');
});
app.get('/login',(req,res)=>res.render('login'));
app.get('/signup',(req,res)=>res.render('signup'));

app.post('/login',(req,res)=>{
    const {email, password} = req.body;
    dbinstance.collection('user').findOne({email,password})
    .then(user => {
        if(user){
            console.log(user);
            req.session.user = user;
            res.redirect('/dashboard');
        } else {
            res.status(401).render('login',{msg:"Invalid email or password"});
        }
    })
    .catch(err=>{
        res.status(500).send("Error reading data from db");
    });
});

app.post('/signup',(req,res)=>{
    const {name, email, password} = req.body;

    dbinstance.collection('user').findOne({email})
    .then(existingUser => {
        if(existingUser){
            res.send("User already exists");
        } else {
            const role = 'user';
            const selectedProduct = [];
            return dbinstance.collection('user').insertOne({name,email,password,role,selectedProduct});
        }
    })
    .then(result => {
        if(result){
            res.redirect('/login');
        }
    })
    .catch(err=>{
        res.status(500).send("Error writing data to db");
    });
});

app.get('/dashboard',authenciate,(req,res)=>{
    res.render('dashboard',{user:req.session.user});
});

app.get('/users',authenciate,authorize,(req,res)=>{
    dbinstance.collection('user').find({})
    .toArray()
    .then(data=> res.render('users',{user:req.session.user,users:data}))
    .catch(()=>res.send("Error geting users.. try again"));
})

app.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.status(500).send("Error logging out");
        res.redirect('/login');
    });
});

app.listen(3000,()=>console.log("Server running on port 3000"));

