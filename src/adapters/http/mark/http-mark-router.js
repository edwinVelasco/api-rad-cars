const express = require('express');

const { check, checkExact, body } = require('express-validator');

const { validRequest } = require('../middlewares');
const HandlersMark = require('./http-mark-handlers');

module.exports = class ConfigureRouterMark {
    constructor(markUseCases) {
        this.markUseCases = markUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const markHandlers = new HandlersMark(
            this.markUseCases,
        );
        this.router.get(
            '/',
            markHandlers.getMarkHandler,
        );

        this.router.post(
            '/',
            [
                check('name', 'name is required').not().isEmpty(),
                checkExact([body('name').isLength({ min: 3 })], {
                    message: 'Too many fields specified',
                }),
                validRequest,
            ],
            markHandlers.postMarkHandler,
        );

        this.router.put(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const mark = await this.markUseCases.getMarkUseCase(
                        parseInt(id, 10),
                    );
                    if (!mark) throw new Error(`this mark id ${id}, not exists...`);
                }),
                validRequest,
            ],
            markHandlers.putMarkHandler,
        );

        this.router.delete(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const mark = await this.markUseCases.getMarkUseCase(
                        parseInt(id, 10),
                    );
                    if (!mark) throw new Error(`this mark id ${id}, not exists...`);
                    if (mark?.deleted_at !== null) throw new Error(`this mark id ${id}, was removed...`);
                }),
                validRequest,
            ],
            markHandlers.deleteMarkHandler,
        );

        return this.router;
    }
};
