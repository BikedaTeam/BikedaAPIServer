var Schema = require('validate');
var schema = {};
var create = new Schema({
  'stoId' : { type : String, required : true, length : 5,
    message : {
      required : "상점 ID는 필수 입니다.",
      length : "상점 ID는 5자리 입니다."
    } },
  'pointSeCd' : { type : String, required : true, enum:['01','02'],
  message : {
    required : "포인트 구분 코드는 필수 입력입니다.",
    enum : "포인트 구분을 선택하여 주십시오."
  } },
  'pointAmnt' : { match : /^[0-9]$/, required : true,
    message : {
      required : "포인트 금액은 필수 입니다..",
      match : "포인트 금액(원 단위)으로 입력하여 주십시오."
    } },
  'pointNote' : { type : String, required : false
  }
});

schema.create = create;
module.exports = schema;
