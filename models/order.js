module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_order', {
    ordNo : {
      type: DataTypes.STRING(19),
      allowNull: false,
      primaryKey : true,
      comment : "주문 번호"
    },
    stoId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment : "상점 ID"
    },
    ordCusTelno : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "주문 고객 연락처"
    },
    ordCusAdres : {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment : "주문 고객 주소"
    },
    ordCusRoadAdres : {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment : "주문 고객 도로명 주소"
    },
    ordCusLa : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "주문 고객 위도"
    },
    ordCusLo : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "주문 고객 경도"
    },
    ordPaySeCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "주문 결재 구분 코드"
    },
    ordAmnt : {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment : "주문 금액"
    },
    ordDlvrAmnt : {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment : "주문 배달 금액"
    },
    ordPickReqTm : {
      type: DataTypes.STRING(6),
      allowNull: true,
      defaultValue: '000000',
      comment : "주문 픽업 요청 시간"
    },
    ordRecvDt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue : DataTypes.NOW,
      comment : "주문 접수 일시"
    },
    ordDsptcDt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment : "주문 배차 일시"
    },
    ordPickDt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment : "주문 픽업 일시"
    },
    ordDlvrTcDt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment : "주문 배달 일시"
    },
    ordDlvrDstnc : {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      comment : "주문 배달 거리"
    },
    ordStateCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "주문 상태 코드"
    },
    ordReqCn : {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment : "주문 요청 내용"
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
