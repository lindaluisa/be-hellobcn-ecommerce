// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialization
const app = express();

// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Import Routes
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');
const itemRoutes = require('./routes/item');
const vendorRoutes = require('./routes/vendor');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');
const imagesRoutes = require('./routes/images');

// Connect to DB
mongoose.connection.openUri('mongodb://localhost:27017/hellobcnDB', (err, res)=> {

  if (err) throw err;

  console.log('Database: \x1b[32m%s\x1b[0m', 'online');
})

// Server index config
const serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Routes
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/item', itemRoutes);
app.use('/vendor', vendorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagesRoutes);

app.use('/', appRoutes);

// Listen
app.listen(3001, function () {
  console.log('Listen to server 3001');
})


// Routes are imported above but still not usable
// using middleware app.use
// whenever a request matches the respective route, then use appRoutes
