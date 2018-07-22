const express = require('express');

const app = express();

const path = require('path');
const fs = require('fs');     // filesystem

// Routes
app.get('/:type/:img', (req, res, next) => {

  const type = req.params.type;
  const img = req.params.img;

  const imgPath = path.resolve( __dirname, `../uploads/${type}/${img}`);
  

  if (fs.existsSync(imgPath) ) {
    res.sendFile(imgPath);
  } else {
    const noImgPath = path.resolve( __dirname, `../assets/no-img.jpg`);
    res.sendFile( noImgPath );
  }
});

module.exports = app;