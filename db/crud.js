/*
    Requirements
*/

const path = require('path');

const { commaSeparate } = require(path.resolve(__dirname, '../utils'));
const { pool } = require(path.resolve(__dirname, './pool.js'));

/*
    Utility functions
*/

const buildVars = columns => columns.map((column, index) => `\$${index + 1}`);

const buildVarString = columns => commaSeparate(buildVars(columns));

const buildPairString = columns => {
    const pairedItems = [];
    columns.forEach((column, index) => {
        pairedItems.push(`${column} = ${buildVars(columns)[index]}`);
    });
    return commaSeparate(pairedItems);
};

/*
    Constructor function
*/

function CRUD(table, columns) {

    this.colString = commaSeparate(columns);
    this.varString = buildVarString(columns);
    this.pairString = buildPairString(columns);

    this.templates = {
        create: {
            text: `INSERT INTO ${table} (${this.colString}) VALUES (${this.varString}) RETURNING *;`,
            expected: columns.length
        },
        readById: {
            text: `SELECT * FROM ${table} WHERE id = $1;`,
            expected: 1
        },
        readAll: {
            text: `SELECT * FROM ${table};`,
            expected: 0
        },
        update: {
            text: `UPDATE ${table} SET ${this.pairString} WHERE id = $${columns.length + 1} RETURNING *;`,
            expected: columns.length + 1
        },
        deleteById: {
            text: `DELETE FROM ${table} WHERE id = $1;`,
            expected: 1
        },
        deleteAll: {
            text: `DELETE FROM ${table};`,
            expected: 0
        }
    };

    this.run = function(operation, values=[]) {

        const expected = this.templates[operation].expected;
        const received = values.length;

        if (expected != received) {
            throw new Error(`CRUD '${operation}' expects ${expected} value(s), but received ${received}`)
        };
        return pool.query({
            name: operation,
            text: this.templates[operation].text,
            values: values
        });
    };
};

/*
    Exports
*/

module.exports = { CRUD };
