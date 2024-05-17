module.exports = (sequelize, DataTypes) => {
    const Garden = sequelize.define('Garden', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {        
          model: 'User',   
          key: 'id'
        }
      },
      garden_state: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      tableName: 'garden',
      timestamps: true, 
    });

    Garden.associate = function(models) {
      Garden.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
    };

    return Garden;  
};

  