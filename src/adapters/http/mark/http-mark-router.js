const { check } = require('express-validator');

const { validMark } = require('../middlewares');
const HandlersMark = require('./http-mark-handlers');

module.exports = class ConfigureRouterMark {
    constructor(express, markUseCases) {
        this.express = express;
        this.markUseCases = markUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = this.express.Router();
        const markHandlers = new HandlersMark(
            this.markUseCases,
        );
        this.router.get(
            '/marks/',
            markHandlers.getMarkHandler,
        );

        this.router.post(
            '/marks/',
            markHandlers.postMarkHandler,
        );

        this.router.put(
            '/marks/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const mark = await this.markUseCases.getMarkUseCase(
                        parseInt(id, 10),
                    );
                    if (!mark) throw new Error(`this mark id ${id}, not exists...`);
                }),
                validMark,
            ],
            markHandlers.putMarkHandler,
        );

        this.router.delete(
            '/marks/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const mark = await this.markUseCases.getMarkUseCase(
                        parseInt(id, 10),
                    );
                    if (!mark) throw new Error(`this mark id ${id}, not exists...`);
                }),
                validMark,
            ],
            markHandlers.deleteMarkHandler,
        );

        return this.router;
    }
};
