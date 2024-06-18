const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const secretKey = process.env.JWT_PRIVATE_KEY;

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.render('login', { error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.render('login', { error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '6h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/home');
});

router.get('/generate-token', (req, res) => {
    const payload = {
      user_id: "12345"
    };
  
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    res.json({ token });
  });

module.exports = router;
