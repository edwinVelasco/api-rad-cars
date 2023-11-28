const { check } = require('express-validator');
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
                }),
                validRequest,
            ],
            providerHandlers.deleteProviderHandler,
        );

        return this.router;
    }
};
