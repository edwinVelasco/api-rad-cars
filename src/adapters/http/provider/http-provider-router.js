const { check, checkExact, body } = require('express-validator');
const express = require('express');
const { validRequest } = require('../middlewares');
const HandlersProvider = require('./http-provider-handlers');

module.exports = class ConfigureRouterProvider {
    constructor(providerUseCases) {
        this.providerUseCases = providerUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const providerHandlers = new HandlersProvider(
            this.providerUseCases,
        );
        this.router.get(
            '/',
            providerHandlers.getProviderHandler,
        );

        this.router.post(
            '/',
            [
                check('nit', 'nit is required').not().isEmpty(),
                check('name', 'name is required').not().isEmpty(),
                check('contact', 'contact is required').not().isEmpty(),
                check('email', 'email is required').not().isEmpty(),
                checkExact([body('email').isEmail(), body('nit').isLength({ min: 6 }), body('contact').isLength({ min: 7 }), body('name').isLength({ min: 3 })], {
                    message: 'Too many fields specified',
                }),
                validRequest,
            ],
            providerHandlers.postProviderHandler,
        );

        this.router.put(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const provider = await this.providerUseCases.getProviderUseCase(
                        parseInt(id, 10),
                    );
                    if (!provider) throw new Error(`this provider id ${id}, not exists...`);
                }),
                validRequest,
            ],
            providerHandlers.putProviderHandler,
        );

        this.router.delete(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const provider = await this.providerUseCases.getProviderUseCase(
                        parseInt(id, 10),
                    );
                    if (!provider) throw new Error(`this provider id ${id}, not exists...`);
                    if (provider?.deleted_at !== null) throw new Error(`this provider id ${id}, was removed...`);
                }),
                validRequest,
            ],
            providerHandlers.deleteProviderHandler,
        );

        return this.router;
    }
};
