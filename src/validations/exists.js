export default function (knex) {
    return function exists(data, field, message, [tableName, dbField = field], get) {

        if ('string' !== typeof tableName || !tableName.length) {
            return Promise.reject('A proper table name should be provided.');
        }

        // The value of field to validate the uniqueness.
        const value = get(data, field);

        // Pass the validation if value does not exists.
        // Value existence is not this rule's concern.
        if (!value || ('string' === typeof value && value.trim().length === 0)) {
            return Promise.resolve('validation passed');
        }

        // checking for username inside database
        const query = knex.table(tableName).where(dbField, value);

        return query.count('id as count')
            .then(results => {
                const count = results[0].count.toString();

                if (count !== '0') {
                    return 'validation passed';
                }

                return Promise.reject(message);
            });
    }
};
