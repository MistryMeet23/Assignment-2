const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);
const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: false }));

// Set up session handling with file store
app.use(session({
    store: new FileStore({}),
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// Route: Login Page
app.get('/', (req, res) => {
    if (req.session.username) {
        return res.redirect('/dashboard');
    }
    res.render('login');
});

// Route: Handle Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simple authentication (you can replace this with database authentication)
    if (username === 'admin' && password === 'password') {
        req.session.username = username;
        return res.redirect('/dashboard');
    } else {
        return res.redirect('/');
    }
});

// Route: Dashboard Page
app.get('/dashboard', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/');
    }
    res.render('dashboard', { username: req.session.username });
});

// Route: Handle Logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
