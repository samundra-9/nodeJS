const express = require("express");
// const mongodb = require("mongodb");
const session = require("express-session");
const multer = require("multer");
const mongoose = require('mongoose');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "." + file.mimetype.split("/")[1]),
});
const fileFilter = (req, file, cb) => {
  const type = file.mimetype;
  // console.log(type);
  const ext = type.split("/")[1];
  if (ext === "jpeg" || ext === "png" || ext === "jpg") cb(null, true);
  else cb(new Error("Only jpeg, png, jpg files are allowed"), false);
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 },
});

const app = express();
app.use("/uploads", express.static("uploads"));
app.use("/style.css", express.static("style.css"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "keepItSecret",
  })
);

// const client = mongodb.MongoClient;
// let dbinstance;

// client
//   .connect("mongodb://127.0.0.1:27017")
//   .then((db) => {
//     dbinstance = db.db("ecom");
//     console.log("db connected");
//   })
//   .catch((err) => console.log("Error connecting to DB", err));

//  connection via mongoose
mongoose.connect('mongodb://127.0.0.1:27017/ecom')
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => console.log("Error connecting to DB", err));

// mongoose models

const selectedProductSchema = new mongoose.Schema({
  name : String,
  price : String,
  description : String,
  quantity : Number, // for cart quantity
  image : String
});

const userSchema = new mongoose.Schema({
  name : String,
  email : String,
  password : String,
  role : {type : String, default : 'user'},
  selectedProduct : [selectedProductSchema],
  block : {type : Boolean, default : false}
},{collection:'user'});

const productSchema = new mongoose.Schema({
  name :String,
  price : String,
  description : String,
  quantity : Number,  //stock
  image : String
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

function authenciate(req, res, next) {
  if (req.session.user) next();
  else res.render("login", { msg: "login first" });
}
function authorize(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") next();
  else res.send("Access denied ..Unauthorized access");
}

app.get("/", (req, res) => {
  if (req.session.user) res.redirect("/dashboard");
  else res.render("login", { msg: "" });
});
app.get("/login", (req, res) => res.render("login", { msg: "" }));
app.get("/signup", (req, res) => res.render("signup"));

app.post("/login", async(req, res) => {
  try{
     const user =await User.findOne(req.body) // {email, password} = req.body;
     if(!user)
      return res.status(401).render('login',{msg : "Invalid Login Credentials"});
    if(user.block)
      res.status(403).render('login',{msg : "Yoyr account is blocked: Contact Admin"});
    req.session.user = user;
    res.redirect('/dashboard');
  }catch{
    res.status(500).send("Login Error");
  }
});

app.post("/signup", async (req, res) => {
    try{
      const exists = await User.findOne({email : req.body.email});
      if(exists)
        return res.send("User already exists");

      await User.create({...req.body}); // {name, email, password}
      res.redirect("/login");
    }catch{
      res.status(500).send("SignUp error");
    }
});

app.get("/dashboard", authenciate, async(req, res) => {
 try{
  const products = await Product.find({});
  res.render("dashboard",{user:req.session.user, products});
 }catch{
  res.status(500).send("Error fetching products");
 }
});

app.get("/users", authenciate, authorize, async(req, res) => {
  try{
    const users = await User.find({});
    res.render("users",{user:req.session.user,users});
  }catch{
    res.status(500).send("Error loading users");
  }
});



app.get("/blockUnblock/:id", authenciate, authorize, async(req, res) => {
  try{
    const u = await User.findById(req.params.id);
    if(!u) return res.send("User not found");
    u.block = ! u.block;
    await u.save();
    res.redirect("/users");
  }catch{
    res.status(500).send("Error updating user status");
  }
});

app.get("/addproduct", authenciate, authorize, (req, res) => {
  res.render("addproduct", { user: req.session.user });
});
app.post(
  "/addproduct",
  authenciate,
  authorize,
  upload.single("image"),
  async (req, res) => {
   try {
      const { name, price, description, quantity } = req.body;

      await Product.create({
        name,
        price,
        description,
        quantity,
        image: req.file.filename,
      });

      res.send("Product added");
    } catch {
      res.status(500).send("Error adding product");
    }
  }
);

app.get("/cart", authenciate, async (req, res) => {
  try{
    const user = await User.findById(req.session,user._id);
    const products = user.selectedProduct.map((p)=>({
      ...p.toObject(),
      quantity : parseInt(p.quantity)
    }));
    res.render("cart",{user:req.session.user,products});
  }catch{
    res.status(500).send("Cart error");
  }
});

app.get("/view/:id", authenciate, async (req, res) => {
  try{
    const product = await Product.findById(req.params.id);
    res.render('viewproduct',{user:req.session.user, product});
  }catch{
      res.status(500).send("Error loading product");
    }
});

app.get("/removefromcart/:id", authenciate, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    user.selectedProduct = user.selectedProduct.filter(p=> p._id.toString() != req.params.id);
    await user.save();

    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error removing from cart.. try again");
  }
});

app.get("/addtocart/:id/:action", authenciate, async (req, res) => {
  try{
    const user = await User.findById(req.session.user._id);
    const product = await Product.findById(req.params.id);

    const stock = parseInt(product.quantity);
    let cart = user.selectedProduct;

    let item = cart.find(x=> x._id.toString() === product._id.toString());

    if(item){
      let qty = parseInt(item.quantity);
      if(req.params.action === 'inc' && qty < stock) qty++;
      if(req.params.action === 'dec' && qty > 1) qty--;
      item.quantity  = qty;
    }else{
      cart.push({...product.toObject(), quantity : 1});
    }

    await user.save();
    res.redirect('/cart');

  }catch{
    res.status(500).send("cart update error");
  }
});


app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.redirect("/login");
  });
});


app.listen(3000, () => console.log("Server running on port 3000"));
