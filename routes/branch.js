var express = require('express');
var router = express.Router();
var util = require('../util');
var jwt = require('jsonwebtoken');
var mysqlConnect = require('../mysqlConnect');
var { check, validationResult } = require('express-validator');

// 지점 로그인 인증 및 토큰 생성
router.post('/login', [
  check('adminId', '관리자 ID / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty(),
  check('adminPassword', '관리자 ID / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  console.log(req.body);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('branch', 'login', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    if( results.length == 1 ) {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);

      var payload = {
        adminId : json[0].adminId,
        brcofcId : json[0].brcofcId
      };
      var secretOrPrivateKey = process.env.JWT_SECRET;
      var options = {expiresIn: 60*60*24};
      jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
        if(err) return res.status(400).json(util.successFalse(err));
        json[0].token = token;
        res.status(200).json(util.successTrue(json[0]));
      });
    } else {
      res.status(401).json(util.successFalse("관리자 ID 또는 비밀번호가 일치 하지 않습니다."));
    }
  });
});

// 배달 조회(  )
// router.get('/realTimeDelivery', util.isLoggedin, function( req, res, next ) {
router.get('/realTimeDelivery', function( req, res, next ) {
  mysqlConnect('branch', 'realTimeDelivery', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 배달 건수 조회(  )
router.get('/realTimeDeliveryCount', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'realTimeDeliveryCount', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 배달 배차 가능 라이더 조회
router.get('/realTimeDispatchRider', util.isLoggedin, function( req, res, next) {
  mysqlConnect('branch', 'realTimeDispatchRider', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 배달 배차
router.post('/realTimeDispatch', util.isLoggedin, function( req, res, next) {
  mysqlConnect('branch', 'validateDelivery', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].dlvryCnt == 1 ) {
      mysqlConnect('branch', 'realTimeDispatch', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        }
        var string = JSON.stringify(results);
        var json =  JSON.parse(string);
        res.status(200).json(util.successTrue(json));
      });
    } else {
      res.status(401).json(util.successFalse("등록 되지 않은 주문 번호 입니다."));
    }
  });
});

// 배달 취소
router.post('/realTimeCancelDelivery', util.isLoggedin, [
  check('dlvryNo','주문 번호는 필수 입력 입니다. 상점ID(5) + "O" + 날짜(8) + 일련번호 형식으로 입력해 주세요.(ex : S0001O1900123100001)').exists().bail().notEmpty().bail().isLength({ min: 19, max: 19 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('branch', 'validateDelivery', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].dlvryCnt == 1 ) {
      mysqlConnect('branch', 'realTimeCancelDelivery', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        }
        var string = JSON.stringify(results);
        var json =  JSON.parse(string);
        res.status(200).json(util.successTrue(json));
      });
    } else {
      res.status(401).json(util.successFalse("등록 되지 않은 주문 번호 입니다."));
    }
  });
});

// 실시간 라이더 조회
router.get('/realTimeRider', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'realTimeRider', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});
// 실시간 라이더 배달 내용 조회
router.get('/realTimeRiderDelivery', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'realTimeRiderDelivery', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 상점 조회
router.get('/stores', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'stores', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 상점 할증
router.get('/storeSurcharge', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeSurcharge', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 상점 지역 설정
router.get('/storeAreaSetting', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeAreaSetting', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 상점 지역 설정 좌표
router.get('/storeAreaSettingCoordinate', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeAreaSettingCoordinate', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});


// 상점 거리 설정
router.get('/storeDistanceSetting', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeDistanceSetting', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 상점 특별 설정
router.get('/storeSpecialSetting', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeSpecialSetting', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 상점 특별 설정
router.get('/storeSpecialSettingLocation', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeSpecialSettingLocation', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

module.exports = router;
