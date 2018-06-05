export default function (knex) {
    return function unique(data, field, message, [tableName, dbField = field, exclude = null], get) {

        if (!tableName) {
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

        if (exclude) {
            query.whereNot('id', exclude);
        }

        console.log(query.count('id as count').toString());

        return query.count('id as count')
            .then(results => {
                const count = results[0].count.toString();

                if (count === '0') {
                    return 'validation passed';
                }

                return Promise.reject(message);
            });
    }
};
