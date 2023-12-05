const express = require('express');

const { check } = require('express-validator');

const { validRequest } = require('../middlewares');
const HandlersQuotation = require('./http-quotation-handlers');

module.exports = class ConfigureRouterQuotation {
    constructor(quotationUseCases) {
        this.quotationUseCases = quotationUseCases;
        // this.productUseCases = productUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const quotationHandlers = new HandlersQuotation(
            this.quotationUseCases,
        );
        this.router.get(
            '/:idProduct/quotations/',
            quotationHandlers.getQuotationHandler,
        );

        this.router.post(
            '/:idProduct/quotations/',
            quotationHandlers.postQuotationHandler,
        );

        this.router.delete(
            '/:idProduct/quotations/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const quotation = await this.quotationUseCases.getQuotationUseCase(
                        parseInt(id, 10),
                    );
                    if (!quotation) throw new Error(`this Product id ${id}, not exists...`);
                }),
                validRequest,
            ],
            quotationHandlers.deleteQuotationHandler,
        );

        return this.router;
    }
};
