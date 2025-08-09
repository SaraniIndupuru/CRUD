const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 5000;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/studentDataBase', {
  useNewUrlParser: true, useUnifiedTopology: true 
});

const studentSchema = new mongoose.Schema({
  rollNo: String,
  name: String,
  degree: String,
  city: String
});

const Student = mongoose.model('Student', studentSchema);

//Home and display table
app.get('/', async (req, res) => {
  const students = await Student.find();
  res.render('index', { students });
});

//Add student
app.post('/add', async (req, res) => {
  const { rollNo, name, degree, city } = req.body;
  const newStudent = new Student({ rollNo, name, degree, city });
  await newStudent.save();
  res.redirect('/');
});

//edit student

app.get('/edit/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('edit', { student });
});

app.post('/edit/:id', async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/');
});


//delete student
app.post('/delete/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on the Port:${PORT}`));
app.use(express.static('public'));