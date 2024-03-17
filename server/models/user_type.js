module.exports = (sequelize, DataTypes) => {
    const User_Type = sequelize.define('user_type', {
      ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Type_Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    }, {
      // Model options
      tableName: 'user_type', 
      timestamps: false, 
    });
  
    return User_Type;
  };
  