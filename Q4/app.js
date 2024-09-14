const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// Database connection
mongoose.connect('mongodb://localhost/student_management', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/index'));

// Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
