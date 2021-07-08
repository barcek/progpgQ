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

    /*
        class: Table

        When called with the 'new' keyword returns a Promise
        which, once the response is received from pool.query
        in the .createTable method, resolves to the instance

        tableName:     string
        tableColNames: array of strings, SQL, one per column

        On instantiation, creates in the database the table
        'tableName' with columns defined in 'tableColNames'

        Exposes the .generateCRUD method, to generate a set
        of CRUD queries for the columns of the table passed

        cf. CRUD class (./crud.js)
    */

    this.template = `CREATE TABLE IF NOT EXISTS ${tableName} (${commaSpaceJoin(tableColNames)});`;

    this.createTable = async (template) => {
    /*
        Returns a Promise resolving to the response received
        when calling pool.query with the .template attribute
    */
        const response = await pool.query(template);
        return response;
    };

    this.cruds = {};

    this.generateCRUD = (crudColNames, condColName) => {
    /*
        Returns a CRUD instance using the current table name
        and stores it keyed by label on the .cruds attribute

        crudColNames: array of strings, columns in query set
        condColName:  string, conditional column if not 'id'
    */
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
