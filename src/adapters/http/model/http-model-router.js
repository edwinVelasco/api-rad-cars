const express = require('express');

const { check, checkExact, body } = require('express-validator');

const { validRequest } = require('../middlewares');
const HandlersModel = require('./http-model-handlers');

module.exports = class ConfigureRouterModel {
    constructor(modelUseCases) {
        this.modelUseCases = modelUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const modelHandlers = new HandlersModel(
            this.modelUseCases,
        );
        this.router.get(
            '/',
            modelHandlers.getModelHandler,
        );

        this.router.post(
            '/',
            [
                check('name', 'name is required').not().isEmpty(),
                check('mark_id', 'mark_id is required').not().isEmpty(),
                checkExact([body('name').isLength({ min: 3 })], {
                    message: 'Too many fields specified',
                }),
                validRequest,
            ],
            modelHandlers.postModelHandler,
        );

        this.router.put(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const model = await this.modelUseCases.getModelUseCase(
                        parseInt(id, 10),
                    );
                    if (!model) throw new Error(`this model id ${id}, not exists...`);
                }),
                validRequest,
            ],
            modelHandlers.putModelHandler,
        );

        this.router.delete(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const model = await this.modelUseCases.getModelUseCase(
                        parseInt(id, 10),
                    );
                    if (!model) throw new Error(`this model id ${id}, not exists...`);
                    if (model?.deleted_at !== null) throw new Error(`this model id ${id}, was removed...`);
                }),
                validRequest,
            ],
            modelHandlers.deleteModelHandler,
        );

        return this.router;
    }
};
