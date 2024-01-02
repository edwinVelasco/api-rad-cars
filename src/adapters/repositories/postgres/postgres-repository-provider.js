const { Op } = require('sequelize');
const moment = require('moment-timezone');

const {
    ProviderModel,
} = require('./models/provider-model');

class PostgresRepositoryProvider {
    // eslint-disable-next-line no-restricted-syntax
    constructor(client) {
        this.client = client;
        this.providerModel = ProviderModel(this.client);
    }

    getProviderRepository(id) {
        try {
            return this.client.models.providers.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    async getAllProviderRepository() {
        try {
            const result = await this.client.models.providers.findAll({
                where: { deleted_at: { [Op.is]: null } },
                attributes: [
                    'id',
                    'nit',
                    'name',
                    'contact',
                    'email',
                ],
                order: [['name', 'ASC']],
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async createProviderRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.providers.create({
                nit: payload.nit,
                name: payload.name,
                contact: payload.name,
                email: payload.email,
                created_at: now,
                updated_at: now,
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async updateProviderRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.providers.update(
                {
                    ...payload,
                    updated_at: now,
                },
                { where: { id } },
            );
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set providers completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async deleteProviderRepository(id) {
        try {
            return await this.client.models.providers.update(
                {
                    deleted_at: moment().tz('UTC'),
                },
                {
                    where: {
                        id,
                    },
                },
            );
        } catch (error) {
            console.log(`Sequelize error in delete providers: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositoryProvider;
