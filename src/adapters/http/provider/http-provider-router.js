const { check } = require('express-validator');

const { validProvider } = require('../middlewares');
const HandlersProvider = require('./http-provider-handlers');

module.exports = class ConfigureRouterProvider {
    constructor(express, providerUseCases) {
        this.express = express;
        this.providerUseCases = providerUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = this.express.Router();
        const providerHandlers = new HandlersProvider(
            this.providerUseCases,
        );
        this.router.get(
            '/providers/',
            providerHandlers.getProviderHandler,
        );

        this.router.post(
            '/providers/',
            providerHandlers.postProviderHandler,
        );

        this.router.put(
            '/providers/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const provider = await this.providerUseCases.getProviderUseCase(
                        parseInt(id, 10),
                    );
                    if (!provider) throw new Error(`this provider id ${id}, not exists...`);
                }),
                validProvider,
            ],
            providerHandlers.putProviderHandler,
        );

        this.router.delete(
            '/providers/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const provider = await this.providerUseCases.getProviderUseCase(
                        parseInt(id, 10),
                    );
                    if (!provider) throw new Error(`this provider id ${id}, not exists...`);
                }),
                validProvider,
            ],
            providerHandlers.deleteProviderHandler,
        );

        return this.router;
    }
};
