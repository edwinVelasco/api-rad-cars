const { Op } = require('sequelize');
const moment = require('moment-timezone');

const {
    MarkModel,
} = require('./models/mark-model');

class PostgresRepositoryMark {
    // eslint-disable-next-line no-restricted-syntax
    constructor(client) {
        this.client = client;
        this.markModel = MarkModel(this.client);
    }

    getMarkRepository(id) {
        try {
            return this.client.models.marks.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    async getAllMarkRepository() {
        try {
            const result = await this.client.models.marks.findAll({
                where: { deleted_at: { [Op.is]: null } },
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

    async createMarkRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.marks.create({
                name: payload.name,
                created_at: now,
                updated_at: now,
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async updateMarkRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.marks.update(
                {
                    ...payload,
                    updated_at: now,
                },
                { where: { id } },
            );
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set marks completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async deleteMarkRepository(id) {
        try {
            return await this.client.models.marks.update(
                {
                    deleted_at: moment().tz('UTC'),
                },
                {
                    where: { id },
                },
            );
        } catch (error) {
            console.log(`Sequelize error in delete marks: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositoryMark;
