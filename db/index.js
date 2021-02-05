/*
    Requirements
*/

const path = require('path');

const { Table } = require(path.resolve(__dirname, './table.js'));
const { pool } = require(path.resolve(__dirname, './pool.js'));

/*
    Definitions
*/

const endPool = () => {
    pool.end();
};

/*
    Exports
*/

module.exports = {
    Table,
    endPool
};
