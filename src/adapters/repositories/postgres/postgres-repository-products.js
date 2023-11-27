class PostgresRepositoryProducts {
    // eslint-disable-next-line no-restricted-syntax
    constructor(client) {
        this.client = client;

    }

    executeQuerySql({ query, values }) {
        return this.db.executeQueryWithValues(query, values);
    }

    getTippingSql(queryParam) {
        const { restaurant_id: restaurantId } = queryParam;
        const query = 'SELECT * FROM toppings WHERE restaurant_id=? AND '
            + 'deleted_at IS NULL;';
        return this.db.executeQueryWithValues(query, [restaurantId]);
    }

    deleteToppingSql(queryParam) {
        const { id } = queryParam;
        const query = 'UPDATE toppings SET deleted_at=NOW() WHERE id=?;';
        return this.db.executeQueryWithValues(query, [id]);
    }

    deactivateToppingsSql(payload, queryParam) {
        const { restaurant_id: restaurantId } = queryParam;
        const { toppings } = payload;
        const query = 'UPDATE toppings SET active = !active WHERE id '
            + 'IN (?) AND restaurant_id = ?;';

        return this.db.executeQueryWithValues(query, [toppings, restaurantId]);
    }
}

module.exports = PostgresRepositoryProducts;
