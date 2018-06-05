import indicative from 'indicative';
import * as Knex from 'knex';
import unique from './validations/unique';

export function init(knexInstance) {
    if (!(knexInstance instanceof Knex)) {
        throw new Error(`Parameter should be an instance of Knex, ${typeof knexInstance} was given.`);
    }
};
