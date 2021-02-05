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

Each CRUD instance has a `label` property, a string created by hyphenating the column names passed. The instance is assigned to the `cruds` property on the Table instance with its `label` property as the key.

Each CRUD instance also exposes a `summarize` method returning a string overview of a given operation, as well as a `summarizeAll' method returning all overviews for that operation set.

```js
oddEntriesCRUD.summarize('create');
oddEntriesCRUD.summarizeAll();
```

The unit tests use the dev dependencies mocha and chai and can be run with the following command:

```shell
npm test
```

## config/

The 'config' directory contains a single 'index.js' file.

### index.js

The 'index.js' file requires the `dotenv` package, destructures environment variables from `process.env` - which draws also from the '.env' file in the root directory - and uses `NODE_ENV` to determine the correct set of database environment variables and export them with truncated identifiers under the `DB` key.

## db/

The 'db' directory contains four files: 'index.js', 'pool.js', 'table.js' and 'crud.js'.

### index.js

The 'index.js' file destructures `Table` and `pool` from their modules and exports the `Table` class and an `endPool` function.

### pool.js

The 'pool.js' file requires the `pg` package and the `DB` environment variables to create a pool exports this as `pool`.

### crud.js

The 'crud.js' file destructures `pool` from its module, as `defaultPool` to support dependency injection, and exports the constructor function `CRUD`, which takes arguments to create a set of standard CRUD queries, specifically `create`, `readById`, `readAll`, `update`, `delete` and `deleteAll`.

### table.js

The 'table.js' file destructures `pool`  and `CRUD` from their modules, each with the 'default-' prefix to support dependency injection, and exports the constructor function `Table`, which takes arguments to create a table if the table does not exist. 

## utils/

The 'utils' directory contains a single 'index.js' file for the sole utility function currently used in both 'table.js' and 'crud.js'.

## test/

The 'test' directory contains three files: 'db.test.js' with test resources and one unit test each for the `Table` and `CRUD` modules.

## .env

The '.env' file contains two sets of database environment variables with placeholder values, one set each for development and production.

## Development plan

The following are possible next steps in the development of the code base. Pull requests are welcome for these and any other potential improvements.

- further generalize the current classes for greater flexibility
- add additional query types
