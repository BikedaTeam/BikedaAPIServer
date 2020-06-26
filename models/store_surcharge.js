module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_store_surcharge', {
    stoId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey : true,
      comment : "상점 ID"
    },
    srchrSeCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey : true,
      comment : "할증 구분 코드"
    },
    srchrCn : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "할증 내용"
    },
    srchrAmnt :{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment : "할증 금액"
    },
    srchrApplyYn : {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'N',
      comment : "할증 적용 여부"
    }
  },
  {
      timestamps: true,
  });
};
