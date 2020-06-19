module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_store_special_location', {
    lctnSeqNo : {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey : true,
      autoIncrement: true,
      comment : "좌표 일련번호"
    },
    setSeqNo : {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey : true,
      comment : "설정 일련번호"
    },
    stoId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey : true,
      comment : "상점 ID"
    },
    lctnLa : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "좌표 위도"
    },
    lctnLo : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "좌표 경도"
    }
  },
  {
      timestamps: true,
  });
};
