module.exports = (sequelize, DataTypes) => {
    const Purchase = sequelize.define('Purchase', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
    }, {
      tableName: 'purchase', 
      timestamps: false, 
    });
  
    return Purchase;
  };
  