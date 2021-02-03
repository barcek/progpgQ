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

    this.table = table;
    this.label = columns.join('-');

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

    this.summarize = function(operation) {
        const expected = this.templates[operation].expected;
        const text = this.templates[operation].text;
        return `${this.table} ${this.label} '${operation}' expects ${expected} value(s) for query '${text}'`;
    };

    this.summarizeAll = function() {
        const explanations = [];
        for (let key of Object.keys(this.templates)) {
            explanations.push(this.summarize(key));
        };
        return explanations.join('\n');
    };

    this.run = function(operation, values=[]) {
        if (this.templates[operation].expected != values.length) {
            throw new Error(`${this.summarize(operation)}, but received ${values.length}`)
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
