const express = require('express');
const app = express();
const sampleData = [
    {id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.99, instock: true},
    {id: 2, title: '1984', author: 'George Orwell', price: 8.99, instock: true},
    {id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 12.99, instock: false},
    {id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', price: 9.99, instock: true},
    {id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 11.99, instock: false}
];
app.get('/',(req,res)=>{
    res.send('Welcome to the Bookstore');
});
app.get('/books',(req,res)=>{
    res.json(sampleData);
});
app.get('/range', (req, res) => {
    const minPrice = parseFloat(req.query.min);
    const maxPrice = parseFloat(req.query.max);
    const filteredBooks = sampleData.filter(book => book.instock &&  (book.price >= minPrice && book.price <= maxPrice));
    filteredBooks.length > 0 ? res.json(filteredBooks) : res.send('No books found in the given price range');
});
app.get('/search',(req,res)=>{
    const term = req.query.term.toLowerCase();
    const results = sampleData.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term)
    );
    results.length > 0 ? res.json(results) : res.send('No books found matching the search term');
});
app.listen(3001, () => { console.log('Bookstore server running on port 3001'); });