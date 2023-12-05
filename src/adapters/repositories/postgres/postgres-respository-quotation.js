const { Op } = require('sequelize');
const moment = require('moment-timezone');

const { QuotationModel } = require('./models/quotation-model');

const { ProductModel } = require('./models/product-model');

const { ProviderModel } = require('./models/provider-model');

const { ModelModel } = require('./models/model-model');

const { CategoryModel } = require('./models/category-model');

const { MarkModel } = require('./models/mark-model');

class PostgresRepositoryQuotations {
    // eslint-disable-next-line no-restricted-syntax
    constructor(client) {
        this.client = client;
        this.markModel = MarkModel(this.client);
        this.categoryModel = CategoryModel(this.client);
        this.modelModel = ModelModel(this.client, this.markModel);
        this.productModel = ProductModel(this.client, this.modelModel, this.categoryModel);
        this.providerModel = ProviderModel(this.client);
        this.quotationModel = QuotationModel(this.client, this.productModel, this.providerModel);
    }

    async getQuotationRepository(id) {
        try {
            return this.client.models.quotations.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    async getAllQuotationsRepository() {
        try {
            const result = await this.client.models.quotations.findAll({
                where: { deleted_at: { [Op.is]: null } },
                include: [
                    {
                        model: this.productModel,
                        as: 'product',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: this.providerModel,
                        as: 'provider',
                        attributes: ['id', 'name'],
                    },
                ],
                attributes: [
                    'id',
                    'price',
                    'description',
                ],
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async createQuotationRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.quotations.create({
                price: payload.price,
                description: payload.description,
                product_id: payload.product_id,
                provider_id: payload.provider_id,
                created_at: now,
                updated_at: now,
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async deleteQuotationRepository(id) {
        try {
            return await this.client.models.quotations.update(
                {
                    deleted_at: moment().tz('UTC'),
                },
                {
                    where: { id },
                },
            );
        } catch (error) {
            console.log(`Sequelize error in delete quotations: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositoryQuotations;
