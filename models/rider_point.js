module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_rider_point', {
    pointSeqNo : {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey : true,
      autoIncrement: true,
      comment : "포인트 일련번호"
    },
    riderId : {
      type: DataTypes.STRING(6),
      allowNull: false,
      primaryKey : true,
      comment : "라이더 ID"
    },
    pointSeCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "포인트 구분 코드"
    },
    pointAmnt :{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment : "포인트 금액"
    },
    pointRegDt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue : DataTypes.NOW,
      comment : "포인트 등록 일시"
    },
    pointNote : {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment : "포인트 메모"
    }
  },
  {
      timestamps: true,
  });
};
