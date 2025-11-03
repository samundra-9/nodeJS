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
    const file = req.file.filename;

    const product = { pname, pprice, Image, file };
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
            res.send('Product uploaded successfully.');
        });
    });
});

app.post("/multiples", upload.array("files", 5), (req, res) => {
  const pname = req.body.pname;
  const pprice = req.body.pprice;

  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const Image = req.files.map((file) => ({
    file: file.path,
  }));

  fs.readFile("product.json", "utf-8", (err, data) => {
    let existingProducts = [];
    if (!err && data) {
      try {
        existingProducts = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing product.json:", parseErr);
      }
    }

    existingProducts.push({ pname, pprice, Image });

    fs.writeFile("product.json",
      JSON.stringify(existingProducts),
      (err) => {
        if (err) {
          console.error("Error saving products:", err);
          return res.status(500).send("Error saving products.");
        }
        res.send("Products uploaded successfully.");
      }
    );
  });
});


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});