const { Op } = require('sequelize');
const moment = require('moment-timezone');

const { MarkModel } = require('./models/mark-model');

const { ModelModel } = require('./models/model-model');

class PostgresRepositoryModel {
    // eslint-disable-next-line no-restricted-syntax
    constructor(client) {
        this.client = client;
        this.markModel = MarkModel(this.client);
        this.modelModel = ModelModel(this.client, this.markModel);
    }

    getModelRepository(id) {
        try {
            return this.client.models.models.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    async getAllModelRepository() {
        try {
            const result = await this.client.models.models.findAll({
                where: { deleted_at: { [Op.is]: null } },
                include: [
                    {
                        model: this.markModel,
                        as: 'mark',
                        attributes: ['id', 'name'],
                    },
                ],
                attributes: [
                    'id',
                    'name',
                ],
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async createModelRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.models.create({
                name: payload.name,
                mark_id: payload.mark_id,
                created_at: now,
                updated_at: now,
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async updateModelRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.models.update(
                {
                    ...payload,
                    updated_at: now,
                },
                { where: { id } },
            );
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set models completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async deleteModelRepository(id) {
        try {
            return await this.client.models.models.update(
                {
                    deleted_at: moment().tz('UTC'),
                },
                {
                    where: { id },
                },
            );
        } catch (error) {
            console.log(`Sequelize error in delete models: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositoryModel;
