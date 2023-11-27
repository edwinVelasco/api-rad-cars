class UseCasesProvider {
    constructor(repositoryProvider) {
        this.repositoryProvider = repositoryProvider;
    }

    async getProvidersUseCase() {
        const [providers] = await this.repositoryProvider.getAllProviderRepository();
        if (providers) return { message: providers, code: 200 };
        return { message: 'Conflict', code: 409 };
    }

    async createProvidersUseCase(payload) {
        const [, error] = await this.repositoryProvider.createProviderRepository(payload);
        if (!error) return { message: 'Created', code: 201 };
        return { message: 'Conflict', code: 409, error };
    }

    async updateProvidersUseCase(payload, id) {
        const [data, error, code] = await this.repositoryProvider.updateProviderRepository(
            payload,
            id,
        );
        if (!error) return { message: 'Updated', code, data };
        return {
            message: 'Conflict', code, error, data,
        };
    }

    async deleteProvidersUseCase(id) {
        const [providers] = await this.repositoryProvider.deleteProviderRepository(id);
        if (providers) return { message: providers, code: 204 };
        return { message: 'Conflict', code: 409 };
    }

    getProviderUseCase(id) {
        return this.repositoryProvider.getProviderRepository(id);
    }
}

module.exports = UseCasesProvider;
