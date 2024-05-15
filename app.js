const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const roomRoutes = require('./routes/roomRoutes');
const actorRoutes = require('./routes/actorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const indexRoutes = require('./routes/indexRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://127.0.0.1:27017/crmDB");

app.use('/', indexRoutes);
app.use('/rooms', roomRoutes);
app.use('/actors', actorRoutes);
app.use('/bookings', bookingRoutes);
app.use('/api', apiRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});