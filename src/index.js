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
const PostgresRepositoryCategory = require('./adapters/repositories/postgres/postgres-repository-category');
const PostgresRepositoryProduct = require('./adapters/repositories/postgres/postgres-repository-product');
const PostgresRepositoryQuotation = require('./adapters/repositories/postgres/postgres-respository-quotation');

/**
 * Config Routers
 */
const ConfigureRouterProvider = require('./adapters/http/provider/http-provider-router');
const ConfigureRouterMark = require('./adapters/http/mark/http-mark-router');
const ConfigureRouterModel = require('./adapters/http/model/http-model-router');
const ConfigureRouterCategory = require('./adapters/http/category/http-category-router');
const ConfigureRouterProduct = require('./adapters/http/product/http-product-router');
const ConfigureRouterQuotation = require('./adapters/http/quotation/http-quotation-router');

/**
 * UseCases
  */
const UseCasesProvider = require('./application/usecases/usecases-provider');
const UseCasesMark = require('./application/usecases/usecases-mark');
const UseCasesModel = require('./application/usecases/usecases-model');
const UseCasesCategory = require('./application/usecases/usecases-category');
const UseCasesProduct = require('./application/usecases/usecases-product');
const UseCasesQuotation = require('./application/usecases/usecases-quotation');

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

    // categories
    const postgresRepositoryCategory = new PostgresRepositoryCategory(
        postgresClient,
    );
    const useCasesCategory = new UseCasesCategory(postgresRepositoryCategory);
    const configureCategoryRouter = new ConfigureRouterCategory(
        useCasesCategory,
    );
    const routerCategory = configureCategoryRouter.setRouter();
    server.addRouter('/api/v1/categories', routerCategory);

    // products
    const postgresRepositoryProduct = new PostgresRepositoryProduct(
        postgresClient,
    );
    const useCasesProduct = new UseCasesProduct(postgresRepositoryProduct);
    const configureProductRouter = new ConfigureRouterProduct(
        useCasesProduct,
    );
    const routerProduct = configureProductRouter.setRouter();
    server.addRouter('/api/v1/products', routerProduct);

    // quotation
    const postgresRepositoryQuotation = new PostgresRepositoryQuotation(
        postgresClient,
    );
    const useCasesQuotation = new UseCasesQuotation(postgresRepositoryQuotation);
    const configureQuotationRouter = new ConfigureRouterQuotation(
        useCasesQuotation,
    );
    const routerQuotation = configureQuotationRouter.setRouter();
    server.addRouter('/api/v1/products', routerQuotation);

    server.listen(env.PORT);
})();
