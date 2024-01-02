const { check, checkExact, body } = require('express-validator');
const express = require('express');
const { validRequest } = require('../middlewares');
const HandlersUser = require('./http-user-handlers');

module.exports = class ConfigureRouterProvider {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const userHandlers = new HandlersUser(
            this.userUseCase,
        );
        this.router.get(
            '/',
            userHandlers.getUserHandler,
        );

        this.router.get(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const user = await this.userUseCase.getUserUseCase(
                        parseInt(id, 10),
                    );
                    if (!user) throw new Error(`this user id ${id}, not exists...`);
                    if (user?.deleted_at) throw new Error(`this user id ${id}, not exists...`);
                }),
                validRequest,
            ],
            userHandlers.getUserHandler,
        );

        this.router.post(
            '/',
            [
                check('cc', 'cc is required').not().isEmpty(),
                check('name', 'name is required').not().isEmpty(),
                check('phone', 'phone is required').not().isEmpty(),
                check('email', 'email is required').not().isEmpty(),
                check('password', 'password is required').not().isEmpty(),
                check('address', 'address is required').not().isEmpty(),
                checkExact([
                    body('email').isEmail(),
                    body('cc').isNumeric(),
                    body('phone').isNumeric(),
                    body('cc').isLength({ min: 8 }),
                    body('phone').isLength({ min: 7 }),
                    body('name').isLength({ min: 3 }),
                    body('password').isLength({ min: 6 })], {
                    message: 'Too many fields specified',
                }),
                validRequest,
            ],
            userHandlers.postUserHandler,
        );

        this.router.put(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const user = await this.userUseCase.getUserUseCase(
                        parseInt(id, 10),
                    );
                    if (!user) throw new Error(`this user id ${id}, not exists...`);
                }),
                validRequest,
            ],
            userHandlers.putUserHandler,
        );

        this.router.delete(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const user = await this.userUseCase.getUserUseCase(
                        parseInt(id, 10),
                    );
                    if (!user) throw new Error(`this user id ${id}, not exists...`);
                    if (user?.deleted_at !== null) throw new Error(`this user id ${id}, was removed...`);
                }),
                validRequest,
            ],
            userHandlers.deleteUserHandler,
        );

        return this.router;
    }
};
