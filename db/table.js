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
        When called with the 'new' keyword returns a Promise,
        resolving to the Table instance once the response is
        received from pool.query in the .createTable method

        tableName:     string
        tableColNames: array of strings, SQL, one per column
    */

    /*
        The table creation query for the parameters passed
    */
    this.template = `CREATE TABLE IF NOT EXISTS ${tableName} (${commaSpaceJoin(tableColNames)});`;

    /*
        Returns a Promise resolving to the response received
        from pool.query called with the .template attribute
    */
    this.createTable = async (template) => {
        const response = await pool.query(template);
        return response;
    };

    /*
        A record of all CRUD instances, each keyed by label,
        generated through calls to the .generateCRUD method
    */
    this.cruds = {};

    /*
        Returns a CRUD instance using the current table name
        and stores it keyed by label on the .cruds attribute

        crudColNames: array of strings, columns in query set
        condColName:  string, conditional column if not 'id'

        cf. CRUD class (./crud.js)
    */
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
