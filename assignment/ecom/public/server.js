const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use("/src", express.static(path.join(__dirname, "../src")));

app.use("/upload", express.static(path.join(__dirname, "../upload")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/contact.html"));
});

// app.get("/wall.jpg", (req, res) => {
//   res.sendFile(path.join(__dirname, "../upload/wall.jpg"));
// });

app.use((req, res) => {
  res.status(404).send("404 Page Not Found");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
