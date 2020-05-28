module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_store_zone_setting', {
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
    setZone : {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment : "설정 구역"
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
