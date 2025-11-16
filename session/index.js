const express = require('express');
const app = express();
app.use('/uploads', express.static('uploads'));
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const ejs = require('ejs');
const Storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null, __dirname + '/uploads/');
    },
    filename : (req,file,cb)=>{
        cb(null, Date.now() + ".jpeg");
    }
});
const filter = (req,file,cb)=>{
    const type = file.mimetype;
    console.log(type);
    const ext = type.split('/')[1];
    if(ext === 'jpeg' || ext === 'png' || ext === 'jpg') cb(null, true);
    else cb(new Error('Only jpeg, png, jpg files are allowed'), false);
}
const upload = multer({storage: Storage, fileFilter: filter, limits: {fileSize: 1024 * 1024 * 1}});

mongoose.connect('mongodb://localhost:27017/sessionDB')
.then(()=>{
    console.log("Connected to MongoDB for session management");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    role : { type: String, default: 'user' }
});
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    imagePath: String
})
const User = mongoose.model('User',userSchema);
const Product = mongoose.model('Product',productSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(session({
    saveUninitialized : true,
    resave : false,
    secret :" hey1234"
}));

function isAuthenticated(req, res, next) {
    if (req.session && req.session.email) {
        return next();  
    } else {
        
        const errMsg = encodeURIComponent('You must be logged in to access this page.');
        req.session.redirectTo = req.originalUrl;
        res.redirect(`/login?error=${errMsg}`); 
    }
}

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/dashboard', isAuthenticated,(req,res)=>{
    res.render('dashboard');
});
app.get('/products',isAuthenticated,async(req,res)=>{
    const products =  await Product.find({});
    res.json(products);
})
app.get('/login',(req,res)=>{
    const message = req.query.error || null;
    res.render('login',{message} );
}
);

app.post('/login', async (req,res)=>{
    const { username,email, password } = req.body;
    const user = await User.findOne({username: username,email: email, password: password });
    // console.log(user);
    if(user){
        req.session.email = user.email;
        req.session.role = user.role ;
        const redirectTo = req.session.redirectTo || '/dashboard';
        delete req.session.redirectTo;
        res.redirect(redirectTo);
    } else {
            res.render('login', { message: "Invalid credentials. Please try again or sign up." });
    }
});
app.get('/admin',isAuthenticated, (req,res)=>{
    if(req.session.role === 'admin'){
        res.render('admin');
    } else {
        res.status(403).send("Access denied");
    }
})

app.post('/addNewProduct', isAuthenticated, upload.single('productImage'), async (req, res) => {
    if (req.session.role !== 'admin') {
        return res.status(403).send("Access denied");
    }
        // Handle adding new product logic here
        const { productName, productPrice, productQuantity } = req.body;
        const productImage = req.file; 
        // console.log(productImage);

        const newProduct = await Product.create({
            name: productName,
            price: productPrice,
            quantity: productQuantity,
            imagePath: productImage.filename
        });

        if (!newProduct) {
            return res.status(500).send("Error adding new product.");
        }
        res.send("New product added successfully.");
});

app.get('/signup',(req,res)=>{
    res.render('signup');
});
app.post('/signup',async (req,res)=>{
    const { username, email, password } = req.body;
    const validUser = await User.findOne({ email: email });
    if(validUser){
        return  res.send("<h1>Username or Email already exists. Please <a href='/signup'>try again</a></h1>");
    }
    const newUser = await  User.create({ username, email, password });
    if(newUser){
        res.send("<h1>Signup successful. Please <a href='/login'>login</a></h1>");
    } else {
        res.send("<h1>Signup failed. Please try again.</h1>");
    }
});

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.send("Error logging out");
        }
        res.redirect('/');
    });
});

app.listen(4000, ()=>{
    console.log("Session app is running on port 4000");
});