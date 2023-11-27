const { DataTypes } = require('sequelize');

const PriorityLevelModel = (Client) => {
    const model = Client.define(
        'rad_cars_providers',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            nit: {
                type: DataTypes.STRING,
            },
            contact: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
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

    return model;
};

module.exports = {
    PriorityLevelModel,
};
