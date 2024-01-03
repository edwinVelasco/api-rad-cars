const express = require('express');

const { check, checkExact, body } = require('express-validator');

const { validRequest, checkAuth, checkRoleAuth } = require('../middlewares');
const HandlersQuotation = require('./http-quotation-handlers');

module.exports = class ConfigureRouterQuotation {
    constructor(quotationUseCases, productUseCases) {
        this.quotationUseCases = quotationUseCases;
        this.productUseCases = productUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const quotationHandlers = new HandlersQuotation(
            this.quotationUseCases,
        );
        this.router.get(
            '/:id/quotations/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const product = await this.productUseCases.getProductUseCase(
                        parseInt(id, 10),
                    );
                    if (!product) throw new Error(`this product id ${id}, not exists...`);
                    if (product?.deleted_at !== null) throw new Error(`this product id ${id}, was removed...`);
                }),
                validRequest,
            ],
            quotationHandlers.getQuotationHandler,
        );

        this.router.post(
            '/:id/quotations/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const product = await this.productUseCases.getProductUseCase(
                        parseInt(id, 10),
                    );
                    if (!product) throw new Error(`this product id ${id}, not exists...`);
                    if (product?.deleted_at !== null) throw new Error(`this product id ${id}, was removed...`);
                }),
                check('price', 'price is required').not().isEmpty(),
                check('description', 'description is required').not().isEmpty(),
                check('product_id', 'product_id is required').not().isEmpty(),
                check('provider_id', 'provider_id is required').not().isEmpty(),
                checkExact([body('price').isLength({ min: 3 }), body('description').isLength({ min: 4 })], {
                    message: 'Too many fields specified',
                }),
                validRequest,
            ],
            quotationHandlers.postQuotationHandler,
        );

        this.router.delete(
            '/:idProduct/quotations/:id/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const quotation = await this.quotationUseCases.getQuotationUseCase(
                        parseInt(id, 10),
                    );
                    if (!quotation) throw new Error(`this quotation id ${id}, not exists...`);
                    if (quotation?.deleted_at !== null) throw new Error(`this quotation id ${id}, was removed...`);
                }),
                validRequest,
            ],
            quotationHandlers.deleteQuotationHandler,
        );

        return this.router;
    }
};
