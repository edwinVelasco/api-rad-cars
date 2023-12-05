const express = require('express');

const { check } = require('express-validator');

const { validRequest } = require('../middlewares');
const HandlersProduct = require('./http-product-handlers');

module.exports = class ConfigureRouterProduct {
    constructor(productUseCases) {
        this.productUseCases = productUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const productHandlers = new HandlersProduct(
            this.productUseCases,
        );
        this.router.get(
            '/',
            productHandlers.getProductsHandler,
        );

        this.router.get(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const product = await this.productUseCases.getOneProductUseCase(
                        parseInt(id, 10),
                    );
                    if (!product) throw new Error(`this product id ${id}, not exists...`);
                }),
                validRequest,
            ],
            productHandlers.getProductHandler,
        );

        this.router.post(
            '/',
            productHandlers.postProductHandler,
        );

        this.router.put(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const product = await this.productUseCases.getProductUseCase(
                        parseInt(id, 10),
                    );
                    if (!product) throw new Error(`this product id ${id}, not exists...`);
                }),
                validRequest,
            ],
            productHandlers.putProductHandler,
        );

        this.router.delete(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const product = await this.productUseCases.getProductUseCase(
                        parseInt(id, 10),
                    );
                    if (!product) throw new Error(`this product id ${id}, not exists...`);
                    if (product?.deleted_at !== '') throw new Error(`this product id ${id}, was removed...`);
                }),
                validRequest,
            ],
            productHandlers.deleteProductHandler,
        );

        return this.router;
    }
};
