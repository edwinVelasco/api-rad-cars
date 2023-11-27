const { check } = require('express-validator');

const { validModel } = require('../middlewares');
const HandlersModel = require('./http-model-handlers');

module.exports = class ConfigureRouterModel {
    constructor(express, modelUseCases) {
        this.express = express;
        this.modelUseCases = modelUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = this.express.Router();
        const modelHandlers = new HandlersModel(
            this.modelUseCases,
        );
        this.router.get(
            '/models/',
            modelHandlers.getModelHandler,
        );

        this.router.post(
            '/models/',
            modelHandlers.postModelHandler,
        );

        this.router.put(
            '/models/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const model = await this.modelUseCases.getModelUseCase(
                        parseInt(id, 10),
                    );
                    if (!model) throw new Error(`this model id ${id}, not exists...`);
                }),
                validModel,
            ],
            modelHandlers.putModelHandler,
        );

        this.router.delete(
            '/models/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const model = await this.modelUseCases.getModelUseCase(
                        parseInt(id, 10),
                    );
                    if (!model) throw new Error(`this model id ${id}, not exists...`);
                }),
                validModel,
            ],
            modelHandlers.deleteModelHandler,
        );

        return this.router;
    }
};
