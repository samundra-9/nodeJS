const express = require("express");
const mongoose = require("mongoose");
const MONGO_URI = "mongodb://localhost:27017/sessionDB";
const multer = require('multer');
const path = require('path');
const session = require('express-session');

const storage = multer.diskStorage({
  destination : (req,file,cb)=>cb(null,path.resolve(__dirname,"uploads")),
  filename : (req,file,cb)=> cb(null,Date.now()+'.jpeg')
});
const fileFilter = (req, file, cb) => {
  const type = file.mimetype;
  console.log(type);
  const ext = type.split('/')[1];
  if(ext === 'jpeg' || ext === 'png' || ext === 'jpg') cb(null, true);
  else cb(new Error('Only jpeg, png, jpg files are allowed'), false);
}
const upload = multer({storage,fileFilter,limits:{fileSize:1024*1024}})

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB for session management"))
  .catch((err) => console.error("Mongo connect error:", err));

const looseSchema = new mongoose.Schema({}, { strict: false });
const usersLooseSchema = new mongoose.Schema({},{strict:false});
const Product = mongoose.model('Product',looseSchema,'products');
const Users = mongoose.model('Users',usersLooseSchema,'users')
// let products = [
//   { id: 1, name: "keyboard", price: 100, desc: "cskn" },
//   { id: 2, name: "mouse", price: 290, desc: "cnjk" },
// ];
// const users = [
//   { username: "abc", email: "a@bc",password:"123456", marks: [20, 30, 40, 50] },
//   { username: "axyzbc", email: "axy@bc",password:"121212", marks: [20, 10, 40, 50] },
//   { username: "avd", email: "avd@bc",password:"212121", marks: [20, 30, 40, 90] },
// ];
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname,'uploads')));

app.use(session({
  saveUninitialized:false,
  resave:false,
  secret:"keepItSecret"
}));

function authenticate(req,res,next){
  if (req.session && req.session.email) next();
   else res.render("login",{msg:"Login to view"});
}

app.get('/login',(req,res)=>res.render('login'));
app.get('/signup',(req,res)=>res.render('signup'));
app.post('/login',async(req,res)=>{
  try{
  const {email,password} = req.body;
  const user = await Users.findOne({email})
  const err = "Credntials didnt Match";
  if(user && user.password == password ){
      req.session.email = email;
      req.session.id = user._id;
      // console.log(req.session.email)
      res.redirect('/');
    }
   else res.render('login',{err});
  }
  catch (error) {
    console.log("error loggin in");
    res.render('signup');
  }
});
app.post('/signup',(req,res)=>{
  const {username,email,password} = req.body;
  const user = Users.findOne({email});
  if(user) res.render('signup',{msg:"User already exists"});
  Users.create({username,email,password});
  res.redirect('/login');
})

app.get("/", authenticate, async(req, res) => {
  try {
    console.log(req.session.email);
    const allProducts = await Product.find({});
    // console.log(allProducts);
    res.render('home',{products:allProducts});
  } catch (error) {
   console.log("error getting /",error.message()) 
  }
  
})

app.get("/user", authenticate, (req, res) => res.render("user", { users }));

app.get("/view/:id",authenticate, async(req, res) => {
  const product = await Product.findOne({_id : req.params.id})
  res.render("viewItem", { product: product });
});

app.get("/delete/:id",authenticate,  async(req, res) => {
  const product = await Product.deleteOne({_id: req.params.id});
  res.redirect("/");
});
app.get("/update/:id",authenticate, async(req, res) => {
  const product = await Product.findOne({_id:req.params.id});
  res.render("update", { product: product });
});
app.post("/update/:id",authenticate, upload.single('file'), async(req, res) => {
  const {name , price, quantity} = req.body;
  console.log(req.body)
const allProducts = await Product.findByIdAndUpdate(req.params.id, {name,price,quantity,imagePath:req.file.filename},{new:true});
//   products = products.map((product) =>
//     product.id == req.params.id
//       ? {
//           id: product.id,
//           name: req.body.name,
//           price: req.body.price,
//           desc: req.body.desc,
//         }
//       : product
//   );
  res.redirect("/");
});
app.get("/add", authenticate,(req, res) => res.render("addProduct"));
app.post("/add",authenticate, upload.single('file'), async(req, res) => {
  const { name, price, quantity } = req.body;
  console.log(req.body);
  const allProducts = await Product.create( { name, price, quantity, imagePath:req.file.filename })
  console.log(allProducts);
  res.redirect("/");
});

app.get('/cart/:id/add',authenticate, async(req,res)=>{
  try{
  let cartDetails = req.session.cart || [];
  const product = await Product.findOne({_id : req.params.id});
  if(!product) return res.redirect('/');

  const prodId = product._id.toString();
  const existing = cartDetails.find(item=> item.productId === prodId);
  if(existing){
    existing.qty = (existing.qty || 0) + 1;
  } else {
    cartDetails.push({
      productId: prodId,
      name: product.name,
      price: product.price,
      imagePath: product.imagePath,
      qty: 1
    })
  }
  req.session.cart = cartDetails;
  res.redirect('/');
  }
  catch(err){
    console.error('Error adding to cart',err);
    res.redirect('/');
  }
})
app.get('/cart/:id/sub',authenticate,async(req,res)=>{
  try{
  let cartDetails = req.session.cart || [];
  const prodId = req.params.id;
  const idx = cartDetails.findIndex(item=> item.productId === prodId || item.productId === prodId.toString());
  if(idx === -1) return res.redirect('/');

  if(cartDetails[idx].qty > 1){
    cartDetails[idx].qty -= 1;
  } else {
    cartDetails.splice(idx,1);
  }
  req.session.cart = cartDetails;
  res.redirect('/');
  }
  catch(err){
    console.error('Error subtracting from cart',err);
    res.redirect('/');
  }

})

app.get('/cart', authenticate, (req,res)=>{
  res.json(req.session.cart || []);
})

app.get('/cart/:id', authenticate, async (req, res) => {
  try {
    let cartdetails = req.session.cart ? req.session.cart : [];
    let flag = false;
    for (let ele of cartdetails) {
      if (ele.productId === req.params.id || ele.productId === req.params.id.toString() || ele.id === req.params.id) {
        ele.qty = (ele.qty || 0) + 1;
        flag = true;
        break;
      }
    }

    if (!flag) {
      const product = await Product.findById(req.params.id);
      if (product) {
        const item = {
          id: product._id.toString(),
          productId: product._id.toString(),
          name: product.name,
          price: product.price,
          imagePath: product.imagePath,
          qty: 1,
        };
        cartdetails.push(item);
      }
    }

    req.session.cart = cartdetails;
    res.redirect('/');
  } catch (err) {
    console.error('Error in /cart/:id', err);
    res.redirect('/');
  }
});

// showcart endpoint (alias for debugging)
app.get('/showcart', authenticate, (req, res) => {
  res.json(req.session.cart || []);
});
app.listen(8000);
