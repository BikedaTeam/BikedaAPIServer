var jwt = require('jsonwebtoken');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var util = {};

util.successTrue = function(data){
  return {
    success:true,
    errors:null,
    data:data
  };
};

util.successFalse = function(err){
  if(!err&&!message) message = 'data not found';
  return {
    success:false,
    errors:(err)? util.parseError(err): null,
    data:null
  };
};

util.parseError = function(errors){
  var parsed = {};

  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  } else if( errors.errors ) {
    parsed = errors.errors;
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};


// middlewares
util.isLoggedin = function(req,res,next){
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).json(util.successFalse(null,'token is required!'));
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
