module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_store_special_setting', {
    setSeqNo : {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey : true,
      autoIncrement: true,
      comment : "설정 일련번호"
    },
    stoId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey : true,
      comment : "상점 ID"
    },
    setNm : {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment : "설정 내용"
    },
    setAmnt :{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment : "설정 금액"
    }
  },
  {
      timestamps: true,
  });
};
