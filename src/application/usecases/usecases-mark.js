class UseCasesMark {
    constructor(repositoryMark) {
        this.repositoryMark = repositoryMark;
    }

    async getMarksUseCase() {
        const [marks] = await this.repositoryMark.getAllMarkRepository();
        if (marks) return { message: marks, code: 200 };
        return { message: 'Conflict', code: 409 };
    }

    async createMarksUseCase(payload) {
        const [, error] = await this.repositoryMark.createMarkRepository(payload);
        if (!error) return { message: 'Created', code: 201 };
        return { message: 'Conflict', code: 409, error };
    }

    async updateMarksUseCase(payload, id) {
        const [data, error, code] = await this.repositoryMark.updateMarkRepository(
            payload,
            id,
        );
        if (!error) return { message: 'Updated', code, data };
        return {
            message: 'Conflict', code, error, data,
        };
    }

    async deleteMarkUseCase(id) {
        const mark = await this.repositoryMark.deleteMarkRepository(id);
        if (mark) return { message: mark, code: 204 };
        return { message: 'Conflict', code: 409 };
    }

    getMarkUseCase(id) {
        return this.repositoryMark.getMarkRepository(id);
    }
}

module.exports = UseCasesMark;
