const { addParenthesisSet, formatValuesForSql } = require('./builder-functions');

class BuilderUpdate {
    constructor(product) {
        this.product = product;
        this.query = '';
        this.fields = [];
        this.interrogantsValues = [];
        this.values = [];
    }

    build() {
        this.pushName();
        this.pushDescription();
        this.pushPrice();
        this.pushImageUrl();

        this.setQuery();
        this.values = formatValuesForSql(this.values);

        return {
            query: this.query,
            values: this.values,
        };
    }

    setQuery() {
        if (
            this.fields.length !== this.interrogantsValues.length
            || this.values.length !== this.interrogantsValues.length
        ) {
            throw new Error(
                'the lists of fields and value are not the same length',
            );
        }

        this.query = 'UPDATE products SET ';
        this.query = addParenthesisSet(this.query, this.fields, this.interrogantsValues);

        this.query += ' WHERE id = ?;';
        this.values.push(this.product.id);
    }

    /**
     *
     * @param field --> column of table
     * @param value --> value to register
     */
    pushValue(field, value) {
        if (value) {
            this.fields.push(field);
            this.values.push(value);
            this.interrogantsValues.push('?');
        }
    }

    pushName() {
        this.pushValue('name', this.product?.name);
    }

    pushDescription() {
        if (this.product?.description) this.pushValue('description', this.product?.description);
    }

    pushPrice() {
        this.pushValue('price', this.product?.price);
    }

    pushImageUrl() {
        this.pushValue('image_url', this.product?.image_url);
    }

    pushRestaurantId() {
        this.pushValue('restaurant_id', this.product?.restaurant_id);
    }
}

module.exports = BuilderUpdate;
