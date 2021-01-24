# progpgQ

A directory subtree for programmatic table and CRUD query creation in Node.js, requiring the `pg` package for PostgreSQL.

All or part of the subtree and its file content can be incorporated into a larger project to abstract away the query code itself.

In addition, the 'config' folder applies a useful destructure-truncate-export approach to environment variables to reduce environment variable identifier length and uses `NODE_ENV` to determine the correct set of database environment variables.

## Getting started

A table can be created by creating an instance of the `Table` class, passing the following:

- the name of the table as a string;
- an array of strings, each containing the SQL for a single column.

```js
const entriesTable = new Table('entries', [
    'id SERIAL PRIMARY KEY',
    'entry_1 VARCHAR(255) NOT NULL',
    'entry_2 VARCHAR(255) NOT NULL',
    'entry_3 VARCHAR(255) NOT NULL'
]);
```

A set of CRUD operations for the table can then be instantiated using the `CRUD` class, passing an array of strings, each string the name of a column in the table.

```js
const oddEntriesCRUD = entriesTable.generateCRUD(['entry_1', 'entry_3']);
```

## config/

The 'config' directory contains a single 'index.js' file.

### index.js

The 'index.js' file requires the `dotenv` package, destructures environment variables from `process.env` - which draws also from the '.env' file in the root directory - and uses `NODE_ENV` to determine the correct set of database environment variables and export them with truncated identifiers under the `DB` key.

## db/

The 'db' directory contains three files: 'pool.js', 'table.js' and 'crud.js'.

### pool.js

The 'pool.js' file requires the `pg` package and the `DB` environment variables to create `pool` and exports this.

### crud.js

The 'crud.js' file requires `pool` and exports the constructor function `CRUD` taking arguments to create a set of standard CRUD queries, specifically `create`, `readById`, `readAll`, `update`, `delete` and `deleteAll`.

### table.js

The 'table.js' file requires `pool` and `CRUD` and exports the constructor function `Table` receiving arguments to create a table if the table does not exist. 

## utils/

The 'utils' directory contains a single 'index.js' file for the sole utility function currently used in both 'table.js' and 'crud.js'.

## .env

The '.env' file contains two sets of database environment variables with placeholder values, one set each for development and production.

## Development plan

The following are possible next steps in the development of the code base. Pull requests are welcome for these and any other potential improvements.

- further generalize the current classes for greater flexibility
- add further query types
