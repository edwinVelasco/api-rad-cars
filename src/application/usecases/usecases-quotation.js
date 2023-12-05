class UseCasesQuotation {
    constructor(repositoryQuotation) {
        this.repositoryQuotation = repositoryQuotation;
    }

    async getQuotationsUseCase() {
        const [quotation] = await this.repositoryQuotation.getAllQuotationsRepository();
        if (quotation) return { message: quotation, code: 200 };
        return { message: 'Conflict', code: 409 };
    }

    async createQuotationUseCase(payload) {
        console.log('Result:', JSON.stringify(payload));
        const [, error] = await this.repositoryQuotation.createQuotationRepository(payload);
        if (!error) return { message: 'Created', code: 201 };
        return { message: 'Conflict', code: 409, error };
    }

    async deleteQuotationUseCase(id) {
        const quotation = await this.repositoryQuotation.deleteQuotationRepository(id);
        if (quotation) return { message: quotation, code: 204 };
        return { message: 'Conflict', code: 409 };
    }

    getQuotationUseCase(id) {
        return this.repositoryQuotation.getQuotationRepository(id);
    }
}

module.exports = UseCasesQuotation;
