const express = require('express');

const { check } = require('express-validator');

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
                }),
                validRequest,
            ],
            markHandlers.deleteMarkHandler,
        );

        return this.router;
    }
};
