module.exports = (sequelize, DataTypes) => {
    const Garden = sequelize.define('Garden', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'User', 
          key: 'id'
        }
      },
      garden_state: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'garden',
      timestamps: false 
    });

    return Garden;
};
