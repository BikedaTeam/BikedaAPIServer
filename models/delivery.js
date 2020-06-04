module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_delivery', {
    dlvryNo : {
      type: DataTypes.STRING(19),
      allowNull: false,
      primaryKey : true,
      comment : "배달 번호"
    },
    stoBrcofcId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment : "상점 지점 ID"
    },
    stoId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment : "상점 ID"
    },
    dlvryCusTelno : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "배달 고객 연락처"
    },
    dlvryCusAdres : {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment : "배달 고객 주소"
    },
    dlvryCusRoadAdres : {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment : "배달 고객 도로명 주소"
    },
    dlvryCusDetlAdres : {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment : "배달 고객 상세 주소"
    },
    dlvryCusLa : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "배달 고객 위도"
    },
    dlvryCusLo : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "배달 고객 경도"
    },
    dlvryPaySeCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "배달 결재 구분 코드"
    },
    dlvryFoodAmnt : {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment : "배달 음식 금액"
    },
    dlvryAmnt : {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment : "베달 금액"
    },
    dlvryPickReqTm : {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment : "배달 픽업 요청 시간"
    },
    dlvryRecvDt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue : DataTypes.NOW,
      comment : "배달 접수 일시"
    },
    dlvryDsptcDt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment : "배달 배차 일시"
    },
    dlvryPickDt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment : "배달 픽업 일시"
    },
    dlvryTcDt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment : "배달 일시"
    },
    dlvryDstnc : {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      comment : "배달 거리"
    },
    dlvryStateCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "배달 상태 코드"
    },
    dlvryReqCn : {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment : "배달 요청 내용"
    },
    riderBrcofcId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment : "라이더 지점 ID"
    },
    riderId : {
      type: DataTypes.STRING(6),
      allowNull: false,
      comment : "라이더 ID"
    }
  },
  {
      timestamps: true,
  });
};
