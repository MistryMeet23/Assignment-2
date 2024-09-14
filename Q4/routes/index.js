const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

// Home Route
router.get('/', (req, res) => {
    res.render('index', { message: req.flash('message') });
});

// Register Route
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newStudent = new Student({ name, email, password: hashedPassword });
        await newStudent.save();
        req.flash('message', 'Registration successful!');
        res.redirect('/login');
    } catch (error) {
        req.flash('message', 'Error registering student');
        res.redirect('/register');
    }
});

// Login Route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (student && await bcrypt.compare(password, student.password)) {
            req.session.studentId = student._id;
            res.redirect('/students');
        } else {
            req.flash('message', 'Invalid credentials');
            res.redirect('/login');
        }
    } catch (error) {
        req.flash('message', 'Error logging in');
        res.redirect('/login');
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// CRUD Operations for Students
router.get('/students', async (req, res) => {
    if (!req.session.studentId) return res.redirect('/login');
    try {
        const students = await Student.find();
        res.render('students', { students });
    } catch (error) {
        res.status(500).send('Error fetching students');
    }
});

router.get('/students/edit/:id', async (req, res) => {
    if (!req.session.studentId) return res.redirect('/login');
    try {
        const student = await Student.findById(req.params.id);
        res.render('edit', { student });
    } catch (error) {
        res.status(500).send('Error fetching student');
    }
});

router.post('/students/edit/:id', async (req, res) => {
    if (!req.session.studentId) return res.redirect('/login');
    try {
        const { name, email } = req.body;
        await Student.findByIdAndUpdate(req.params.id, { name, email });
        res.redirect('/students');
    } catch (error) {
        res.status(500).send('Error updating student');
    }
});

router.get('/students/delete/:id', async (req, res) => {
    if (!req.session.studentId) return res.redirect('/login');
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/students');
    } catch (error) {
        res.status(500).send('Error deleting student');
    }
});

module.exports = router;
