module.exports = (sequelize, DataTypes) => {
    const User_Type = sequelize.define('user_type', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type_name: {
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
  