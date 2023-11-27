const { DataTypes } = require('sequelize');

const ProviderModel = (Client) => Client.define(
    'providers',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        nit: {
            type: DataTypes.STRING(50),
        },
        name: {
            type: DataTypes.STRING(50),
        },
        contact: {
            type: DataTypes.STRING(20),
        },
        email: {
            type: DataTypes.STRING(100),
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

module.exports = {
    ProviderModel,
};
