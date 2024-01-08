const env = require('./src/infraestructure/dotenv/envs');

const Server = require('./src/infraestructure/express/express-server');

/**
 * Postgresql
 */
const { createPostgresClient } = require('./src/infraestructure/db/postgres');

/**
 * Repositories
 */
const PostgresRepositoryProvider = require('./src/adapters/repositories/postgres/postgres-repository-provider');
const PostgresRepositoryMark = require('./src/adapters/repositories/postgres/postgres-repository-mark');
const PostgresRepositoryModel = require('./src/adapters/repositories/postgres/postgres-repository-model');
const PostgresRepositoryCategory = require('./src/adapters/repositories/postgres/postgres-repository-category');
const PostgresRepositoryProduct = require('./src/adapters/repositories/postgres/postgres-repository-product');
const PostgresRepositoryQuotation = require('./src/adapters/repositories/postgres/postgres-respository-quotation');
const PostgresRepositoryUser = require('./src/adapters/repositories/postgres/postgres-repository-user');
const PostgresRepositoryOrder = require('./src/adapters/repositories/postgres/postgres-repository-order');

/**
 * Config Routers
 */
const ConfigureRouterProvider = require('./src/adapters/http/provider/http-provider-router');
const ConfigureRouterMark = require('./src/adapters/http/mark/http-mark-router');
const ConfigureRouterModel = require('./src/adapters/http/model/http-model-router');
const ConfigureRouterCategory = require('./src/adapters/http/category/http-category-router');
const ConfigureRouterProduct = require('./src/adapters/http/product/http-product-router');
const ConfigureRouterQuotation = require('./src/adapters/http/quotation/http-quotation-router');
const ConfigureRouterUser = require('./src/adapters/http/user/http-user-router');
const ConfigureRouterOrder = require('./src/adapters/http/order/http-order-router');

/**
 * UseCases
  */
const UseCasesProvider = require('./src/application/usecases/usecases-provider');
const UseCasesMark = require('./src/application/usecases/usecases-mark');
const UseCasesModel = require('./src/application/usecases/usecases-model');
const UseCasesCategory = require('./src/application/usecases/usecases-category');
const UseCasesProduct = require('./src/application/usecases/usecases-product');
const UseCasesQuotation = require('./src/application/usecases/usecases-quotation');
const UseCasesUser = require('./src/application/usecases/usecases-user');
const UseCasesOrder = require('./src/application/usecases/usecases-order');

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
    // eslint-disable-next-line max-len
    const configureQuotationRouter = new ConfigureRouterQuotation(useCasesQuotation, useCasesProduct);
    const routerQuotation = configureQuotationRouter.setRouter();
    server.addRouter('/api/v1/products', routerQuotation);

    // user
    const postgresRepositoryUser = new PostgresRepositoryUser(
        postgresClient,
    );
    const useCasesUser = new UseCasesUser(postgresRepositoryUser);
    const configureUserRouter = new ConfigureRouterUser(
        useCasesUser,
    );
    const routerUser = configureUserRouter.setRouter();
    server.addRouter('/api/v1/users', routerUser);

    // order
    const postgresRepositoryOrder = new PostgresRepositoryOrder(
        postgresClient,
    );
    const useCasesOrder = new UseCasesOrder(postgresRepositoryOrder);
    const configureOrderRouter = new ConfigureRouterOrder(useCasesOrder);
    const routerOrder = configureOrderRouter.setRouter();
    server.addRouter('/api/v1/orders', routerOrder);

    server.listen(env.PORT);
})();
