const jwt = require('jsonwebtoken');

const SECRET_KEY = require('../config/config').SECRET_KEY;

const verifyToken = (req, res, next) => {

  const token = req.query.token;

  jwt.verify( token, SECRET_KEY, ( err, decoded ) => {

    if ( err ) {
      return res.status(401).json({
        ok: false,
        message: 'Incorrect token',
        errors: err
      });
    }


    req.user = decoded.user;

    next();

  });
}


module.exports = {
  verifyToken
};
