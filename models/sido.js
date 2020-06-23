module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_sido', {
    sdCd : {
      type: DataTypes.STRING(2),
      allowNull: false,
      primaryKey : true,
      comment : "시도 코드"
    },
    sdNm : {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment : "시도 명"
    }
  },
  {
      timestamps: true,
  });
};
