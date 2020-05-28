var Schema = require('validate');
var schema = {};
var create = new Schema({
  'shareId' : { type : String, required : true, length : 5,
    message : {
      required : "공유 ID는 필수 입니다.",
      length : "공유 ID는 5자리 입니다."
    } },
  'brcofcId' : { type : String, required : true, length : 5,
    message : {
      required : "지점 ID는 필수 입니다.",
      length : "지점 ID는 5자리 입니다."
  } },
  'shareDelayTime' : { match : /^[0-9]$/, required : true,
    message : {
      required : "공유 지연 시간은 필수 입니다..",
      match : "공유 지연 시간은(초 단위)으로 입력하여 주십시오."
    } },
  'pointNote' : { type : String, required : false
  }
});

var update = new Schema({
  'shareId' : { type : String, required : true, length : 5,
    message : {
      required : "공유 ID는 필수 입니다.",
      length : "공유 ID는 5자리 입니다."
    } },
  'brcofcId' : { type : String, required : true, length : 5,
    message : {
      required : "지점 ID는 필수 입니다.",
      length : "지점 ID는 5자리 입니다."
  } },
  'shareDelayTime' : { match : /^[0-9]$/, required : true,
    message : {
      required : "공유 지연 시간은 필수 입니다..",
      match : "공유 지연 시간은(초 단위)으로 입력하여 주십시오."
    } },
  'pointNote' : { type : String, required : false
  }
});

schema.create = create;
schema.update = update;
module.exports = schema;
