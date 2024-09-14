const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: File upload only supports the following file types - jpeg, jpg, png, pdf'));
    }
  }
});

// Route for rendering the form
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Route for handling form submission
router.post('/register', upload.array('files', 5), async (req, res) => {
  const { name, email } = req.body;
  const files = req.files.map(file => file.filename); // Store just filenames

  try {
    const user = new User({ name, email, files });
    await user.save();
    res.send('User registered successfully!');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/files', async (req, res) => {
  try {
    const users = await User.find();
    res.render('files', { users });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  res.download(filePath, err => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

module.exports = router;
