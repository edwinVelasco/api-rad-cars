const { DataTypes } = require('sequelize');

const ModelModel = (Client, markModel) => {
    const model = Client.define(
        'models',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
            },
            mark_id: {
                type: DataTypes.INTEGER,
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            paranoid: true,

            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        },
    );
    markModel.hasMany(model, {
        foreignKey: 'id',
    });
    model.belongsTo(markModel, {
        as: 'mark',
        foreignKey: 'mark_id',
    });

    return model;
};

module.exports = {
    ModelModel,
};
