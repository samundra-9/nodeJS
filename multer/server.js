const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: __dirname + '/uploads/' });


app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/upload.html");
});

app.post("/uploads", upload.single('file'), (req, res) => {
    const pname = req.body.pname;
    const pprice = req.body.pprice;
    const Image = req.file.path;
    const files = req.file.filename;

    const product = { pname, pprice, Image, files };
    fs.readFile(__dirname + '/product.json', 'utf-8', (err, data) => {
        let products = [];
        if (!err && data) {
            products = JSON.parse(data);
        }
        products.push(product);
        fs.writeFile('product.json', JSON.stringify(products), (err) => {
            if (err) {
                return res.status(500).send('Error saving product.');
            }
        res.sendFile(__dirname + "/dashboard.html");
        });
    });
});

app.post("/multiples", upload.array("files", 5), (req, res) => {
  const pname = req.body.pname;
  const pprice = req.body.pprice;

  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const files = req.files.map((file) => (file.filename));

  fs.readFile("product.json", "utf-8", (err, data) => {
    let existingProducts = [];
    if (!err && data) {
      try {
        existingProducts = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing product.json:", parseErr);
      }
    }

    existingProducts.push({ pname, pprice, files });

    fs.writeFile("product.json",
      JSON.stringify(existingProducts),
      (err) => {
        if (err) {
          console.error("Error saving products:", err);
          return res.status(500).send("Error saving products.");
        }
        res.sendFile(__dirname + "/dashboard.html");
      }
    );
  });
});

app.get("/products",(req,res)=>{
  fs.readFile(__dirname + '/product.json', 'utf-8',(err,data)=>{
    if(err){
      console.error("Error reading products:", err);
      return res.status(500).send("Error reading products.");
    }
    res.send(JSON.parse(data));
  })
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});