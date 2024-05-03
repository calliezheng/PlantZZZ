module.exports = (sequelize, DataTypes) => {
    const Purchase = sequelize.define('Purchase', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'purchase', 
      timestamps: false, 
    });
  
    return Purchase;
  };
  