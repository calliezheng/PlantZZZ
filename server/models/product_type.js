module.exports = (sequelize, DataTypes) => {
    const Product_Type = sequelize.define('Product_Type', {
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
        defaultValue: true,
      },
    }, {
      tableName: 'product_type', 
      timestamps: false, 
    });
  
    return Product_Type;
  };
  