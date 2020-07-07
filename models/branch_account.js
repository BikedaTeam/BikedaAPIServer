module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_branch_account', {
    adminId : {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey : true,
      comment : "관리자 ID"
    },
    brcofcId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey : true,
      comment : "지점 ID"
    },
    adminPassword : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "관리자 비밀번호"
    },
    adminNm : {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment : "관리자 이름"
    },
    adminCelno : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "관리자 연락처"
    },
    adminGradeCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "관리자 등급 코드"
    },
    adminUseYn : {
      type: DataTypes.STRING(1),
      allowNull: false,
      comment : "관리자 사용 여부"
    }
  },
  {
      timestamps: true,
  });
};
