const express = require('express')
// const ejs = require('ejs')
let products = [
    {id: 1, name:'keyboard',price:100,desc:'cskn'},
    {id: 2, name:'mouse', price:290, desc:"cnjk"}
]
const users = [
    {name:'abc',email:'a@bc',marks:[20,30,40,50]},
    {name:'axyzbc',email:'axy@bc',marks:[20,10,40,50]},
    {name:'avd',email:'avd@bc',marks:[20,30,40,90]}
]
const app = express()
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.get('/',(req,res)=>res.render('home',{products}))
app.get('/user',(req,res)=>res.render('user',{users}))
app.get('/view/:id',(req,res)=>{
    const product = products.filter(product => product.id == req.params.id);
    res.render('viewItem',{product:product[0]});
});

app.get('/delete/:id',(req,res)=>{
    products = products.filter(product=> product.id != req.params.id)
    res.redirect('/');
});
app.get('/update/:id',(req,res)=>{
    const product = products.filter(product => product.id == req.params.id)
    res.render('update',{product:product[0]});
})
app.post('/update/:id',(req,res)=>{
    // const {name , price, desc} = req.body;
    products.forEach(product => {
        if(product.id == req.params.id){
            product = {id:product.id,name:req.body.name,price:req.body.price,desc:req.body.desc};
        }
    });
    res.redirect('/');
})
app.get('/add',(req,res)=>res.render('addProduct'))
app.post('/add',(req,res)=>{
    const {name , price, desc} = req.body;
    products = [...products,{id : 5, name,price, desc}];
    res.redirect('/');
})
app.listen(3000);