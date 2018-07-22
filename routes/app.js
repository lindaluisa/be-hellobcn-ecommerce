const express = require('express');

const app = express();


// Routes
app.get('/', (req, res, next) => {
  res.status(200).json({
    ok: true,
    message: 'Anfrage korrekt'
  })
})

module.exports = app;