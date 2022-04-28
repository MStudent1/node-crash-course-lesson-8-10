const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog'); //Inserts blog.js which contains the schema and model

// express app
const app = express();
//Connect to mongodb
const dbURI = 'mongodb+srv://new-user-1:ZwTyy5lamaIEsQUf@cluster0.uk7mx.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI,  { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));



// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(morgan('dev'));

//mongoose and mongo sandbox routes; creates new document object of collection blogs
app.get('/add-blog', (req, res) => {
  const blog = new Blog({  //Creates a new blog
      title: 'Blog',
      snippet: 'Really cool blog',
      body: 'Interesting blog'
  });
  blog.save() //Saves document to blogs collection on MongoDB Atlas
    .then((result) => { //Sends callback function once the promise resolves from save() method
        res.send(result) //Sends document object info to MongoDB Atlas
    })
    .catch((err) => { //Catches error
        console.log(err);
    })
});

//Retrieves all document objects from the collection called blogs
app.get('/all-blogs', (req, res) => {
  Blog.find() //Uses the model's name and finds all of the document objects stored in collection; asynchronous
    .then((result) => {
      res.send(result);
    })

    .catch((err) => {
      console.log(err);
    });
})

//Finds a single document object of a collection using the unique id assigned to it automatically
app.get('/single-blog', (req, res) => {
  Blog.findById('626ae3e4f007f91b65640dc8')  //Finds a document object by the id (primary key); asynchronous
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
})

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
  const blogs = [
    {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur'},
  ];
  res.render('index', { title: 'Home', blogs });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
