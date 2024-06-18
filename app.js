const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware');

const apiRoutes = require('./api/apiRoutes');
const roomRoutes = require('./routes/roomRoutes');
const actorRoutes = require('./routes/actorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
app.disable("x-powered-by");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://127.0.0.1:27017/crmDB");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


app.get('/', (req, res) => {
    res.redirect('/auth');
});

app.use('/auth', authRoutes);
app.use('/home', authMiddleware, homeRoutes);
app.use('/predictions', authMiddleware, predictionRoutes);
app.use('/reports', authMiddleware, reportsRoutes);
app.use('/rooms', authMiddleware, roomRoutes);
app.use('/actors', authMiddleware, actorRoutes);
app.use('/booking', authMiddleware, bookingRoutes);
app.use('/api', apiKeyMiddleware, apiRoutes);
app.use('/reviews', authMiddleware, reviewRoutes);

app.get('/api-test-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'api-test-page.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});