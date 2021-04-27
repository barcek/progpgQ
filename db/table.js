/*
    Requirements
*/

const path = require('path');

const { commaSpaceJoin } = require(path.resolve(__dirname, '../utils'));
const { pool: defaultPool } = require(path.resolve(__dirname, './pool.js'));
const { CRUD: defaultCRUD } = require(path.resolve(__dirname, './crud.js'));

/*
    Constructor function
*/

function Table(tableName, tableColNames, pool=defaultPool, CRUD=defaultCRUD) {

    this.template = `CREATE TABLE IF NOT EXISTS ${tableName} (${commaSpaceJoin(tableColNames)});`;

    this.createTable = async (template) => {
        const response = await pool.query(template);
        return response;
    };

    this.cruds = {};

    this.generateCRUD = (crudColNames, condColName) => {
        const crud = new CRUD(tableName, crudColNames, condColName);
        this.cruds[crud.label] = crud;
        return crud;
    };

    return (async function(instance) {
        await instance.createTable(instance.template);
        return instance;
    })(this);
};

/*
    Exports
*/

module.exports = { Table };
