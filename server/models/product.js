module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      picture:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    }, {
      tableName: 'product', 
      timestamps: false, 
    });
  
    return Product;
  };
  