const { DataTypes } = require('sequelize');

const QuotationModel = (Client, productModel, providerModel) => {
    const quotation = Client.define(
        'quotations',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            price: {
                type: DataTypes.INTEGER,
            },
            description: {
                type: DataTypes.TEXT,
            },
            product_id: {
                type: DataTypes.INTEGER,
            },
            provider_id: {
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
    productModel.hasMany(quotation, {
        foreignKey: 'id',
    });
    quotation.belongsTo(productModel, {
        as: 'product',
        foreignKey: 'product_id',
    });

    providerModel.hasMany(quotation, {
        foreignKey: 'id',
    });
    quotation.belongsTo(providerModel, {
        as: 'provider',
        foreignKey: 'provider_id',
    });

    return quotation;
};

module.exports = {
    QuotationModel,
};
