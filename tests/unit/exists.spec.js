'use strict'

import 'mocha';
import { assert } from 'chai';
import { prop } from 'pope'
import Knex from 'knex';

import initExists from '../../src/validations/exists';

const knex = Knex({
    dialect: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        database: ':memory:',
        filename: ':memory:',
    },
})

const exists = initExists(knex);

describe('rule "exists"', function () {
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

        return exists(data, field, message, [], prop)
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

        return exists(data, field, message, [tableName], prop)
            .then(() => assert.fail())
            .catch(e => {
                assert.instanceOf(e, Error);
            });
    });

    it('should fail when given data does not exist', function () {
        const data = { email: 'foo@example.com' };
        const field = 'email';
        const message = 'email does not exist';
        const tableName = 'users';

        return exists(data, field, message, [tableName], prop)
            .then(() => assert.fail())
            .catch(e => {
                assert.equal(e, message);
            });
    });

    it('should pass when given data exists', function () {
        const data = { email: 'john.doe@example.com' };
        const field = 'email';
        const message = '';
        const tableName = 'users';

        return exists(data, field, message, [tableName], prop);
    });
});
