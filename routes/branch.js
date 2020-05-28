var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var { check, validationResult } = require('express-validator');

// 바이크다 지점 API Document
router.get('/', function( req, res, next ) {
  res.render('branch', { title: '바이크다 지점 API' });
});

// 바이크다 지점 전체 목록
router.get('/branches', util.isLoggedin, function( req, res, next ) {
  models.branch.findAll().then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 조회( 사업자 등록번호, 지점명, 상호, 대표자명 )
router.get('/branch', util.isLoggedin, function( req, res, next ) {
  var reqParam = req.query || '';
  var brcofcBsnsRgnmb = reqParam.brcofcBsnsRgnmb || '';
  var brcofcNm        = reqParam.brcofcNm || '';
  var brcofcMtlty     = reqParam.brcofcMtlty || '';
  var brcofcRprsntvNm = reqParam.brcofcRprsntvNm || '';

  var query = 'select * from tb_branchs where 1=1 ';
  if( brcofcBsnsRgnmb ) query += 'and brcofcBsnsRgnmb like "%' + brcofcBsnsRgnmb + '%" ';
  if( brcofcNm )        query += 'and brcofcNm like "%' + brcofcNm + '%" ';
  if( brcofcMtlty )     query += 'and brcofcMtlty like "%' + brcofcMtlty + '%" ';
  if( brcofcRprsntvNm ) query += 'and brcofcRprsntvNm like "%' + brcofcRprsntvNm + '%" ';

  models.sequelize.query( query ).spread( function ( result, metadata ) {
    return res.status(200).json( util.successTrue( result ) );
  }, function ( err ) {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 등록
router.post('/branch', util.isLoggedin, [
  check('brcofcBsnsRgnmb').exists().bail().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('brcofcPassword').exists().bail().notEmpty(),
  check('brcofcNm').exists().bail().notEmpty(),
  check('brcofcMtlty').exists().bail().notEmpty(),
  check('brcofcBizSeCd').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('brcofcRprsntvNm').exists().bail().notEmpty(),
  check('brcofcBrdYmd').if(check('brcofcBizSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('brcofcCrprtRgnmb').if(check('brcofcBizSeCd').isIn(['02'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:13, max:13}),
  check('brcofcOpnngYmd').exists().bail().notEmpty().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('brcofcBsnsPlaceAdres').exists().bail().notEmpty(),
  check('brcofcBizcnd').exists().bail().notEmpty(),
  check('brcofcInduty').exists().bail().notEmpty(),
  check('brcofcCelno').exists().bail().notEmpty().isNumeric(),
  check('brcofcFeeSeCd').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('brcofcFeeAmnt').if(check('brcofcFeeSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric(),
  check('brcofcFeeRate').if(check('brcofcFeeSeCd').isIn(['02'])).exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('brcofcStateCd').exists().bail().notEmpty().bail().isIn(['01','02'])
],function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  //입력 값 검증
  var validErrors = branch_valid.create.validate( req.body );
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }

  var data = req.body;
  // 지점 등록 여부 검증
  models.branch.findOne( { where : { brcofcBsnsRgnmb: data.brcofcBsnsRgnmb } } ).then( result => {
    if( result ) {
      validationError.errors.already = {message:'이미 등록된 지점 사업자 등록 번호. brcofcBsnsRgnmb : ' + brcofcBsnsRgnmb };
      return res.status(400).json( util.successFalse( validationError) );
    }
    // 지점 ID 생성
    var query = "select cast( concat('B', lpad( concat( ifnull( max( cast( substr( brcofcId, 2 ) AS unsigned ) ) , 0 ) + 1 ), 4, '0' ) ) as char ) as brcofcId from tb_branchs";
    var brcofcId = '';
    models.sequelize.query( query ).spread( function ( result, metadata ) {
      data.brcofcId = result[0].brcofcId;
      models.branch.create( data ).then( result => {
        return res.status(201).json( util.successTrue( result ) );
      }).catch( err => {
        return res.status(400).json( util.successFalse( err ) );
      });
    }, function ( err ) {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 수정
router.put('/branch', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  //입력 값 검증
  var validErrors = branch_valid.update.validate(req.body);
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }

  var data = req.body;
  delete data.brcofcId;
  // 지점 등록 여부 검증
  models.branch.findOne( { where : { brcofcId: req.body.brcofcId } } ).then( result => {
    if( !result ) {
      validationError.errors.notfound = { message:'존재하지 않는 지점 ID. brcofcId : ' + brcofcId };
      return res.status(400).json( util.successFalse( validationError) );
    }
    models.branch.update( data, { where : { brcofcId: req.body.brcofcId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });

  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 포인트 조회( 지점 ID, 포인트 구분 코드 )
router.get('/branch-point', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  var reqParam = req.query || '';
  var brcofcId      = reqParam.brcofcId || '';
  var pointSeCd     = reqParam.pointSeCd || '';

  if( !brcofcId ) {
    validationError.errors.validate = { message:'지점 ID는 필수 입니다.' };
    return res.status(400).json( util.successFalse( validationError) );
  }
  var where = {}
  where.brcofcId = brcofcId;
  if( pointSeCd ) where.pointSeCd = pointSeCd;
  models.branch_point.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 지점 포인트 등록
router.post('/branch-point', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };

  //입력 값 검증
  var validErrors = point_valid.create.validate(req.body);
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }

  models.branch_point.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 공유 정보 조회( 공유 ID, 지점 ID )
router.get('/branch-share', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  var reqParam = req.query || '';
  var shareId     = reqParam.shareId || '';
  var brcofcId    = reqParam.brcofcId || '';

  if( !shareId && !brcofcId) {
    validationError.errors.validate = { message:'공유 지점 ID 또는 대상 지점 ID 는 필수 입니다.' };
    return res.status(400).json( util.successFalse( validationError) );
  }
  var where = {}
  if( shareId ) where.shareId = shareId;
  if( brcofcId ) where.brcofcId = brcofcId;
  models.branch_share.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 공유  등록
router.post('/branch-share', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };

  //입력 값 검증
  var validErrors = share_valid.create.validate(req.body);
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }
  var data = req.body;
  delete data.shareDelayTime;

  models.branch_share.findAll( { where : data } ).then( result => {
    if( result ) {
      validationError.errors.already = {message:'이미 등록된 지점 공유 정보' };
      return res.status(400).json( util.successFalse( validationError) );
    }
    models.branch_share.create( req.body ).then( result => {
      return res.status(200).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 공유 수정
router.put('/branch-share', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };

  //입력 값 검증
  var validErrors = share_valid.update.validate(req.body);
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }
  var data = req.body;
  delete data.shareDelayTime;

  models.branch_share.findAll( { where : data } ).then( result => {
    if( !result ) {
      validationError.errors.already = {message:'지점 공유 정보가 등록 되어있지 않습니다.' };
      return res.status(400).json( util.successFalse( validationError) );
    }
    delete req.body.shareId;
    delete req.body.brcofcId;

    models.branch_share.update( req.body, { where : data } ).then( result => {
      return res.status(200).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 공유 삭제
router.delete('/branch-share', util.isLoggedin, function ( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  //입력 값 검증
  var validErrors = share_valid.update.validate(req.body);
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }
  var data = req.body;
  delete data.shareDelayTime;

  models.branch_share.findAll( { where : data } ).then( result => {
    if( !result ) {
      validationError.errors.already = {message:'지점 공유 정보가 등록 되어있지 않습니다.' };
      return res.status(400).json( util.successFalse( validationError) );
    }
    delete req.body.shareId;
    delete req.body.brcofcId;

    models.branch_share.destroy( { where : data } ).then( result => {
      return res.status(200).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
module.exports = router;
