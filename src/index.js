const env = require('./infraestructure/dotenv/envs');

const Server = require('./infraestructure/express/express-server');

/**
 * Postgresql
 */
const { createPostgresClient } = require('./infraestructure/db/postgres');

/**
 * Repositories
 */
const PostgresRepositoryProvider = require('./adapters/repositories/postgres/postgres-repository-provider');
const PostgresRepositoryMark = require('./adapters/repositories/postgres/postgres-repository-mark');
const PostgresRepositoryModel = require('./adapters/repositories/postgres/postgres-repository-model');

/**
 * Config Routers
 */
const ConfigureRouterProvider = require('./adapters/http/provider/http-provider-router');
const ConfigureRouterMark = require('./adapters/http/mark/http-mark-router');
const ConfigureRouterModel = require('./adapters/http/model/http-model-router');

/**
 * UseCases
  */
const UseCasesProvider = require('./application/usecases/usecases-provider');
const UseCasesMark = require('./application/usecases/usecases-mark');
const UseCasesModel = require('./application/usecases/usecases-model');

(async () => {
    const postgresClient = await createPostgresClient(
        env.DB_USERNAME,
        env.DB_PASSWORD,
        env.DB_NAME,
        env.DB_HOST,
        env.DB_PORT,
    );
    const server = new Server();

    // providers
    const postgresRepositoryProvider = new PostgresRepositoryProvider(
        postgresClient,
    );
    const useCasesProvider = new UseCasesProvider(postgresRepositoryProvider);
    const configureProviderRouter = new ConfigureRouterProvider(
        useCasesProvider,
    );
    const routerProvider = configureProviderRouter.setRouter();
    server.addRouter('/api/v1/providers', routerProvider);

    // marks
    const postgresRepositoryMark = new PostgresRepositoryMark(
        postgresClient,
    );
    const useCasesMark = new UseCasesMark(postgresRepositoryMark);
    const configureMarkRouter = new ConfigureRouterMark(
        useCasesMark,
    );
    const routerMark = configureMarkRouter.setRouter();
    server.addRouter('/api/v1/marks', routerMark);

    // models
    const postgresRepositoryModel = new PostgresRepositoryModel(
        postgresClient,
    );
    const useCasesModel = new UseCasesModel(postgresRepositoryModel);
    const configureModelRouter = new ConfigureRouterModel(
        useCasesModel,
    );
    const routerModel = configureModelRouter.setRouter();
    server.addRouter('/api/v1/models', routerModel);

    server.listen(env.PORT);
})();
