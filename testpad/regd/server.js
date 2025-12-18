const express = require('express');
const multer = require('multer');

const app = express();
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,__dirname + '/uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+".jpeg");
    }
});

const fileFilter = (req,file,cb)=>{
    const type = file.mimetype;
    // console.log(type);
    const ext = type.split('/')[1];
    if(ext === 'jpeg' || ext === 'jpg' || ext === 'png'){
        cb(null,true);
    }else{
        cb(new Error("invalid file type: only jpeg, jpg, png allowed"),false);
    }
};

const upload = multer({storage, fileFilter, limits: {fileSize: 1024 * 1024 * 2}});
app.use(express.static('uploads'));

let students= []
app.get('/', (req, res) => {
    res.send('Welcome to the Student Registration Portal');
});
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/form.html');
});
app.post('/register', upload.array('photo', 2), (req, res) => {
    const {name, age, city, course, marks} = req.body;
    const photo = req.files ? req.files.map(file => file.filename) : res.send('File upload failed');
    students.push({name, age, city, course, marks, photo});
    res.json({message: 'Student registered successfully', student: {name, age, city, course, marks, photo}});

});
app.listen(3000, () => { console.log('Registration server running on port 3000'); });
