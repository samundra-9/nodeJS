const express = require('express');
const mongodb = require('mongodb');
const session = require('express-session');
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req,file,cb)=>cb(null,'./uploads'),
    filename : (req,file,cb)=> cb(null,Date.now() + '.' + file.mimetype.split('/')[1])    
});
const fileFilter = (req, file, cb) => {
    const type = file.mimetype;
    // console.log(type);
    const ext = type.split('/')[1];
    if(ext === 'jpeg' || ext === 'png' || ext === 'jpg') cb(null, true);
    else cb(new Error('Only jpeg, png, jpg files are allowed'), false);
};
const upload = multer({storage, fileFilter, limits:{fileSize:1024*1024}});

const app = express();
app.use('/uploads',express.static('uploads'));
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
    else res.render('login',{msg:""});
});
app.get('/login',(req,res)=>res.render('login',{msg:""}));
app.get('/signup',(req,res)=>res.render('signup'));

app.post('/login',(req,res)=>{
    const {email, password} = req.body;
    dbinstance.collection('user').findOne({email,password})
    .then(user => {
        if(user){
            if(user.block){
                return res.status(403).render('login', {msg: "Your account is blocked. Please contact admin."});
            }
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
            const block = false;
            return dbinstance.collection('user').insertOne({name,email,password,role,selectedProduct,block});
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
    dbinstance.collection('products').find({})
    .toArray()
    .then(products => {
        res.render('dashboard',{user:req.session.user, products});
    })
    .catch(() => {
        res.status(500).send("Error fetching products");
    });
});

app.get('/users',authenciate,authorize,(req,res)=>{
    dbinstance.collection('user').find({})
    .toArray()
    .then(data=> res.render('users',{user:req.session.user,users:data}))
    .catch(()=>res.send("Error geting users.. try again"));
})
app.get('/addproduct',authenciate,authorize,(req,res)=>{
    res.render('addproduct',{user:req.session.user});
})

app.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.status(500).send("Error logging out");
        res.redirect('/login');
    });
});

app.get('/blockUnblock/:id',authenciate,authorize,(req,res)=>{
    const userId = new mongodb.ObjectId(req.params.id);
    dbinstance.collection('user').findOne({_id:userId})
    .then(user=>{
        if(user){
            const updatedStatus = !user.block;
            return dbinstance.collection('user').updateOne(
                {_id:userId},
                {$set:{block:updatedStatus}}
            );
        } else {
            res.send("User not found");
        }
    })
    .then(() => {
        res.redirect('/users');
    })
    .catch(err => {
        res.status(500).send("Error updating user status");
    });
});

app.get('/addproduct',authenciate,authorize,(req,res)=>{
    res.render('addproduct',{user:req.session.user});
})
app.post('/addproduct',authenciate,authorize,upload.single('image'),(req,res)=>{
    const {name, price, description, quantity} = req.body;
    const image = req.file.filename;
    dbinstance.collection('products').insertOne({name, price, description, quantity, image})
    .then(()=>{
        res.send("Product added successfully");
    })
    .catch(()=>{
        res.status(500).send("Error adding product.. try again");
    });

})

app.listen(3000,()=>console.log("Server running on port 3000"));

