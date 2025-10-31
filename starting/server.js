const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/src/home.html");
})
app.get("/login",(req,res)=>{
    res.sendFile(__dirname + "/src/login.html");
})
app.get("/signup",(req,res)=>{
    res.sendFile(__dirname + "/src/signup.html");
})
app.get("/register",(req,res)=>{
    fs.readFile(__dirname + "/src/userData.json","utf-8",(err,data)=>{
        if(err){
            console.log("Error in reading file" + err);
            res.status(500).send("Internal Server Error");
        }
        const users = JSON.parse(data);
        const { username, email, password } = req.query;
        let filteredUsers = users.filter(user => user.email === email);
        if(filteredUsers.length > 0){
            return  res.send("User already exists with this email");
        }
        users.push({ username, email, password });
        
        fs.writeFile(__dirname + "/src/userData.json", JSON.stringify(users), (err) => {
            if (err) {
                console.log("Error in writing file" + err);
                res.status(500).send("Internal Server Error");
            }
            res.send("User registered successfully");
        });
    });
})
app.post("/checkuser",(req,res)=>{
    fs.readFile(__dirname + "/src/userData.json","utf-8",(err,data)=>{
        if(err){
            console.log("Error in reading file" + err);
            res.status(500).send("Internal Server Error");
        }
        const users = JSON.parse(data);
        const { username, password } = req.body;

        let filteredUsers = users.filter(user => user.username === username && user.password === password);
        if(filteredUsers.length > 0){
            res.redirect("/dashboard");
        }else{
           res.redirect("/signup");
        }
    });
})

app.get("/dashboard",(req,res)=>{
    res.sendFile(__dirname + "/src/dashboard.html");
});

app.get("/addproduct",(req,res)=>{
    res.sendFile(__dirname + "/src/addproduct.html");
})
app.post("/addnew",(req,res)=>{
    fs.readFile(__dirname + "/src/productData.json","utf-8",(err,data)=>{
        if(err){
            console.log("Error in reading file" + err);
            res.status(500).send("Internal Server Error");
        }
        const products = JSON.parse(data);
        const { name, price, quantity, description } = req.body;
        products.push({ name, price, quantity, description });
        fs.writeFile(__dirname + "/src/productData.json", JSON.stringify(products), (err) => {
            if (err) {
                console.log("Error in writing file" + err);
                res.status(500).send("Internal Server Error");
            }
            res.redirect("/dashboard");
        });
    });
})
app.get("/allproducts",(req,res)=>{
    fs.readFile(__dirname + "/src/productData.json","utf-8",(err,data)=>{
        if(err){
            console.log("Error in reading file" + err);
            res.status(500).send("Internal Server Error");
        }
        const products = JSON.parse(data);
        res.json(products);
    });
});

app.listen(3000,(err)=>{
    if(err) console.log("Error in server setup" + err);
    console.log("Server is running on port 3000");
})