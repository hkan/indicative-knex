'use strict'

import 'mocha';
import { assert } from 'chai';
import { prop } from 'pope'
import Knex from 'knex';

import initUnique from '../../src/validations/unique';

const knex = Knex({
    dialect: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        database: ':memory:',
        filename: ':memory:',
    },
})

const unique = initUnique(knex);

describe('rule "unique"', function () {
    after(function () {
        knex.destroy();
    });

    beforeEach(async function () {
        await knex.schema.dropTableIfExists('users');
        await knex.schema.createTable('users', table => {
            table.increments('id');
            table.string('email').unique();
        });
        await knex('users').insert({
            email: 'john.doe@example.com',
        });
    });

    it('should fail when tableName is not defined', function () {
        const data = {};
        const field = '';
        const message = '';

        return unique(data, field, message, [], prop)
            .then(() => assert.fail())
            .catch(e => {
                assert.equal(e, 'A proper table name should be provided.');
            });
    });

    it('should fail when given table does not exist', function () {
        const data = {};
        const field = '';
        const message = '';
        const tableName = 'foo';

        return unique(data, field, message, [tableName], prop)
            .then(() => assert.fail())
            .catch(e => {
                assert.instanceOf(e, Error);
            });
    });

    it('should fail when given data is not unique', function () {
        const data = { email: 'john.doe@example.com' };
        const field = 'email';
        const message = 'email is not unique';
        const tableName = 'users';

        return unique(data, field, message, [tableName], prop)
            .then(() => assert.fail())
            .catch(e => {
                assert.equal(e, message);
            });
    });

    it('should pass when given data is unique', function () {
        const data = { email: 'foo@example.com' };
        const field = 'email';
        const message = 'email is not unique';
        const tableName = 'users';

        return unique(data, field, message, [tableName], prop);
    });
});
