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
app.use(express.urlencoded({ extended: true })); //Middleware used for accepting form data
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

//Passes the document objects of the collection blogs to the index html page
//The html page contains
//Blog routes
app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 }) //Displays the blogs in descending order based on the time stamp the blogs were created
  .then((result) => {
    res.render('index', { title: 'All Blogs', blogs: result })
  })
  .catch((err) => {
    console.log(err);
  })
})

//POST event handler that adds a new blog to the index html page
app.post(('/blogs'), (req, res) => {
  const blog = new Blog(res.body)
  
  blog.save()
  .then((result) => {
    res.redirect('/blogs');
  })
  .catch((err) => {
    console.log(err);
  })
})

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
