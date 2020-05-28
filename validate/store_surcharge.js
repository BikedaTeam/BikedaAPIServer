var Schema = require('validate');
var schema = {};
var create = new Schema({
  'stoId' : { type : String, required : true, length : 5,
    message : {
      required : "상점 ID는 필수 입니다.",
      length : "상점 ID는 5자리 입니다."
    } },
  'srchrSeCd' : { type : String, required : true, enum:['01','02','03','04'],
  message : {
    required : "할증 구분 코드는 필수 입력입니다.",
    enum : "할증 구분을 선택하여 주십시오."
  } },
  'srchrCn' : { type : String, required : false
  }
  'srchrAmnt' : { match : /^[0-9]$/, required : true,
    message : {
      required : "할증 금액은 필수 입니다..",
      match : "할증 금액(원 단위)으로 입력하여 주십시오."
    } },
  'srchrApplyYn' : { type : String, required : true, enum:['Y','N'],
    message : {
      required : "할증 적용 여부는 필수 입력입니다.",
      enum : "할증 적용 여부를 선택하여 주십시오."
    } },
});

var update = new Schema({
  'srchrSeqNo' : { type : String, required : true, length : 5,
    message : {
      required : "상점 ID는 필수 입니다.",
      length : "상점 ID는 5자리 입니다."
    } },
  'stoId' : { type : String, required : true, length : 5,
    message : {
      required : "상점 ID는 필수 입니다.",
      length : "상점 ID는 5자리 입니다."
    } },
  'srchrSeCd' : { type : String, required : true, enum:['01','02','03','04'],
  message : {
    required : "할증 구분 코드는 필수 입력입니다.",
    enum : "할증 구분을 선택하여 주십시오."
  } },
  'srchrCn' : { type : String, required : false
  }
  'srchrAmnt' : { match : /^[0-9]$/, required : true,
    message : {
      required : "할증 금액은 필수 입니다..",
      match : "할증 금액(원 단위)으로 입력하여 주십시오."
    } },
  'srchrApplyYn' : { type : String, required : true, enum:['Y','N'],
    message : {
      required : "할증 적용 여부는 필수 입력입니다.",
      enum : "할증 적용 여부를 선택하여 주십시오."
    } },
});

schema.create = create;
module.exports = schema;
