const express = require('express');

const { check } = require('express-validator');

const { validRequest } = require('../middlewares');
const HandlersCategory = require('./http-category-handlers');

module.exports = class ConfigureRouterCategory {
    constructor(categoryUseCases) {
        this.categoryUseCases = categoryUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const categoryHandlers = new HandlersCategory(
            this.categoryUseCases,
        );
        this.router.get(
            '/',
            categoryHandlers.getCategoriesHandler,
        );

        this.router.post(
            '/',
            categoryHandlers.postCategoryHandler,
        );

        this.router.put(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const category = await this.categoryUseCases.getCategoryUseCase(
                        parseInt(id, 10),
                    );
                    if (!category) throw new Error(`this category id ${id}, not exists...`);
                }),
                validRequest,
            ],
            categoryHandlers.putCategoryHandler,
        );

        this.router.delete(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const category = await this.categoryUseCases.getCategoryUseCase(
                        parseInt(id, 10),
                    );
                    if (!category) throw new Error(`this category id ${id}, not exists...`);
                }),
                validRequest,
            ],
            categoryHandlers.deleteCategoryHandler,
        );

        return this.router;
    }
};
