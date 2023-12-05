class UseCasesModel {
    constructor(repositoryModel) {
        this.repositoryModel = repositoryModel;
    }

    async getModelsUseCase() {
        const [models] = await this.repositoryModel.getAllModelRepository();
        if (models) return { message: models, code: 200 };
        return { message: 'Conflict', code: 409 };
    }

    async createModelsUseCase(payload) {
        console.log('Result:', JSON.stringify(payload));
        const [, error] = await this.repositoryModel.createModelRepository(payload);
        if (!error) return { message: 'Created', code: 201 };
        return { message: 'Conflict', code: 409, error };
    }

    async updateModelsUseCase(payload, id) {
        const [data, error, code] = await this.repositoryModel.updateModelRepository(
            payload,
            id,
        );
        if (!error) return { message: 'Updated', code, data };
        return {
            message: 'Conflict', code, error, data,
        };
    }

    async deleteModelUseCase(id) {
        const model = await this.repositoryModel.deleteModelRepository(id);
        if (model) return { message: model, code: 204 };
        return { message: 'Conflict', code: 409 };
    }

    getModelUseCase(id) {
        return this.repositoryModel.getModelRepository(id);
    }
}

module.exports = UseCasesModel;
