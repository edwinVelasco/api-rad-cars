const { addParenthesisValues, formatValuesForSql } = require('./builder-functions');

module.exports = class BuilderCreate {
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
        this.pushRestaurantId();

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
                'the lists of fields and values ​​are not the same length, possibly it is a problem in the code',
            );
        }

        this.query = 'INSERT INTO products';
        this.query = addParenthesisValues(this.query, this.fields);
        this.query += ' VALUES';
        this.query = addParenthesisValues(
            this.query,
            this.interrogantsValues,
        );
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
        this.pushValue('description', this.product?.description);
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
};
