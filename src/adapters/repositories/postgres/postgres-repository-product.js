const { Op } = require('sequelize');
const moment = require('moment-timezone');

const { ProductModel } = require('./models/product-model');

const { ModelModel } = require('./models/model-model');

const { CategoryModel } = require('./models/category-model');

const { MarkModel } = require('./models/mark-model');

class PostgresRepositoryProducts {
    // eslint-disable-next-line no-restricted-syntax
    constructor(client) {
        this.client = client;
        this.markModel = MarkModel(this.client);
        this.categoryModel = CategoryModel(this.client);
        this.modelModel = ModelModel(this.client, this.markModel);
        // eslint-disable-next-line max-len
        this.productModel = ProductModel(this.client, this.modelModel, this.categoryModel);
    }

    // get product
    async getProductRepository(id) {
        try {
            return this.client.models.products.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    // get one product with the parameters
    async getOneProductRepository(id) {
        try {
            const result = await this.client.models.products.findAll({
                where: { id },
                model_id: {
                    as: 'mark_model',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: this.markModel,
                            as: 'mark',
                            attributes: ['id', 'name'],
                        },
                    ],
                },
                include: [
                    {
                        model: this.modelModel,
                        as: 'mark_model',
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: this.markModel,
                                as: 'mark',
                                attributes: ['id', 'name'],
                            },
                        ],
                    },
                    {
                        model: this.categoryModel,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                ],
                attributes: [
                    'id',
                    'code',
                    'name',
                    'description',
                    'price',
                    'stock',
                    'profit',
                    'images',
                    'transmission',
                ],
            });
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set products completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async getAllProductRepository(query) {
        try {
            const {
                search,
                category,
                mark,
                model,
            } = query;
            const searchFields = ['name', 'description', 'code', '$category.name$', '$mark_model.mark.name$', '$mark_model.name$'];
            const options = {
                include: [
                    {
                        model: this.modelModel,
                        as: 'mark_model',
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: this.markModel,
                                as: 'mark',
                                attributes: ['id', 'name'],
                            },
                        ],
                    },
                    {
                        model: this.categoryModel,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                ],
                attributes: [
                    'id',
                    'code',
                    'name',
                    'description',
                    'price',
                    'stock',
                    'profit',
                    'images',
                    'transmission',
                ],
                where: {
                    deleted_at: { [Op.is]: null },
                },
            };

            // search products by name, description, code, category, mark, model
            if (search) {
                options.where[Op.or] = searchFields.reduce((acc, field) => {
                    acc[field] = { [Op.iLike]: `%${search}%` };
                    return acc;
                }, {});
            }
            // filter products by category, mark and model
            if (category) options.where['$category.name$'] = { [Op.iLike]: `%${category}%` };

            if (mark) options.where['$mark_model.mark.name$'] = { [Op.iLike]: `%${mark}%` };

            if (model) options.where['$mark_model.name$'] = { [Op.iLike]: `%${model}%` };

            const result = await this.client.models.products.findAll(options);
            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async createProductRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.products.create({
                model_id: payload.mark_model,
                category_id: payload.category,
                code: payload.code,
                name: payload.name,
                description: payload.description,
                price: payload.price,
                stock: payload.stock,
                images: payload.images,
                profit: payload.profit,
                transmission: payload.transmission,
                created_at: now,
                updated_at: now,
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async updateProductRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.products.update(
                {
                    ...payload,
                    updated_at: now,
                },
                { where: { id } },
            );
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set products completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async deleteProductRepository(id) {
        try {
            return await this.client.models.products.update(
                {
                    deleted_at: moment().tz('UTC'),
                },
                {
                    where: { id },
                },
            );
        } catch (error) {
            console.log(`Sequelize error in delete products: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositoryProducts;