var jwt = require('jsonwebtoken');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var util = {};

util.successTrue = function(data){
  return {
    success : true,
    message : null,
    data : data
  };
};

util.successFalse = function(err){
  return {
    success:false,
    message : (err)? util.parseError(err): null,
    data : null
  };
};

util.parseError = function(errors){
  if( errors.errors ) {
    console.log(errors.errors[0].msg);
    return errors.errors[0].msg;
  } else if( errors.message ) {
    console.log(errors.message);
    return errors.message;
  } else {
    return errors;
  }
};


// middlewares
util.isLoggedin = function(req,res,next){
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).json(util.successFalse('token is required!'));
  else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if(err) return res.status(401).json(util.successFalse(err));
      else{
        req.decoded = decoded;
        next();
      }
    });
  }
};

module.exports = util;
