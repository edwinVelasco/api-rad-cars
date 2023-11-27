module.exports = class HandlersModel {
    constructor(modelUseCases) {
        this.modelUseCases = modelUseCases;
    }

    getModelHandler = async (req, res) => {
        try {
            const { message, code } = await this.modelUseCases.getModelsUseCase(
                req.query,
            );
            if (code >= 400) return res.status(code).send(message);
            return res.status(code).send({
                ...message,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
            });
        }
    };

    postModelHandler = async (req, res) => {
        try {
            const {
                message,
                code,
                error = null,
            } = await this.modelUseCases.createModelsUseCase(
                req.body,
            );
            if (code >= 400) return res.status(code).send({ message, error });
            return res.status(code).send({
                data: message,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
            });
        }
    };

    putModelHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                data,
                error = null,
            } = await this.modelUseCases.updateModelsUseCase(req.body, id);

            if (code === 400) return res.status(code).send({ message, error });
            return res.status(code).send({
                message,
                data,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
            });
        }
    };

    deleteModelHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                error = null,
            } = await this.modelUseCases.deleteModelUseCase(id);

            if (code === 400) return res.status(code).send({ message, error });
            return res.status(code).send({
                data: message,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
            });
        }
    };
};
