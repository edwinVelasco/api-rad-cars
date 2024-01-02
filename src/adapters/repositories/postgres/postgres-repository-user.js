const { Op } = require('sequelize');
const moment = require('moment-timezone');

const { UserModel } = require('./models/user-model');
const { encrypt } = require('../../../utils/handleBcrypt');

class PostgresRepositoryUser {
    constructor(client) {
        this.client = client;
        this.userModel = UserModel(this.client);
    }

    getUserRepository(id) {
        try {
            return this.client.models.users.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    async getAllUserRepository() {
        try {
            const result = await this.client.models.users.findAll({
                where: { deleted_at: { [Op.is]: null } },
                attributes: [
                    'id',
                    'cc',
                    'name',
                    'phone',
                    'email',
                    'password',
                    'address',
                ],
                order: [['name', 'ASC']],
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async createUserRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const passwordHash = await encrypt(payload.password);
            const result = await this.client.models.users.create({
                cc: payload.cc,
                name: payload.name,
                phone: payload.phone,
                email: payload.email,
                password: passwordHash,
                address: payload.address,
                created_at: now,
                updated_at: now,
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async updateUserRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.users.update(
                {
                    ...payload,
                    updated_at: now,
                },
                { where: { id } },
            );
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set users completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async deleteUserRepository(id) {
        try {
            return await this.client.models.users.update(
                {
                    deleted_at: moment().tz('UTC'),
                },
                { where: { id } },
            );
        } catch (error) {
            console.log(`Sequelize error in delete providers: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositoryUser;
