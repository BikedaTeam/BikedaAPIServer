var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var { check, validationResult } = require('express-validator');

// 공통 API Document
router.get('/', function( req, res, next ) {
  res.render('common', { title: 'Bikeda Store API' });
});


router.get('/coordinate', function( req, res, next ) {
  var where = {};
  where.sdCd = req.query.sdCd;
  where.sggCd = req.query.sggCd;
  where.emdCd = req.query.emdCd;
  where.riCd = req.query.riCd;
  models.coordinate.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

  router.get('/sido', function( req, res, next ) {
  models.sido.findAll().then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});


module.exports = router;
