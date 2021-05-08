# progpgQ

A fileset for programmatic table and CRUD query creation in Node.js using the `pg` package for PostgreSQL.

All or part of the fileset can be incorporated into a larger project to abstract away the core query code.

In addition, the 'config' folder applies a useful destructure-truncate-export approach to environment variables to reduce environment variable identifier length and uses `NODE_ENV` to determine the correct set of database environment variables.

A major part of the code is currently used in the [docNxgres](https://github.com/barcek/docNxgres) containerized back end.

For the whole at a glance, see [the current repository tree](#repository-tree).

## Getting started

A table can be created by creating an instance of the `Table` class, passing the following:

- the name of the table as a string;
- an array of strings, each containing the SQL for a single column.

Note that the constructor function returns an asynchronous function, which resolves to the Table instance only after the response is received from the table creation query.

```js
const entriesTable = await new Table('entries', [
    'id SERIAL PRIMARY KEY',
    'column_1 VARCHAR(255) NOT NULL',
    'column_2 VARCHAR(255) NOT NULL',
    'column_3 VARCHAR(255) NOT NULL'
]);
```

A set of CRUD operations for the table can then be instantiated using the `CRUD` class, passing an array of strings, each string the name of a column in the table.

```js
const oddColumnsCRUD = entriesTable.generateCRUD(['column_1', 'column_3']);
```

The CRUD operations `readById`, `deleteById` and `update` assume that an 'id' column is present and is the column to be used in the `WHERE` clause. If an alternative column is to be used, the relevant column name is passed as a string as the second argument.

```js
const oddColumnsCRUD = entriesTable.generateCRUD(['column_1', 'column_3'], 'column_2');
```

Each CRUD instance has a `label` property, a string created by hyphenating the column names passed. The instance is assigned to the `cruds` property on the Table instance with its `label` property as the key.

Each CRUD instance also exposes a `summarize` method returning a string overview of a given operation, as well as a `summarizeAll' method returning all overviews for that operation set.

```js
oddColumnsCRUD.summarize('create');
oddColumnsCRUD.summarizeAll();
```

A CRUD operation can be performed by calling the `run` method with the first argument the operation name as a string and the second argument the array of expected values.

```js
const response = await oddColumnsCRUD.run('create', ['value_1', 'value_3']);
```

### Unit tests

The unit tests use the npm packages `mocha` and `chai` as dev dependencies and can be run with the following command:

```shell
mocha
```

This command is the current content of the 'test' script in the 'package.json' file, which can be run with the following:

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

The 'crud.js' file destructures `pool` from its module, as `defaultPool` to support dependency injection, and exports the constructor function `CRUD`, which takes arguments to create a set of standard CRUD queries, specifically `create`, `readById`, `readAll`, `update`, `deleteById` and `deleteAll`.

### table.js

The 'table.js' file destructures `pool`  and `CRUD` from their modules, each with the 'default-' prefix to support dependency injection, and exports the constructor function `Table`, which takes arguments to create a table if the table does not exist.

## utils/

The 'utils' directory contains two files: 'index.js' and 'format.js'.

### index.js

The 'index.js' file destructures the sole utility function from 'format.js' and exports it.

### format.js

The 'format.js' file defines and exports a single utility function, `commaSpaceJoin`, currently used in both 'table.js' and 'crud.js'.

## test/

The 'test' directory contains two subdirectories: 'db/' and 'utils/'. The subdirectory 'db/' contains three files: 'db.test.js' with test resources and one unit test file each for the `Table` and `CRUD` modules. The subdirectory 'utils/' contains two files: 'utils.test.js' with test resources and 'format.test.js' for the utility function in 'utils/format.js'.

## .env

The '.env' file contains two sets of database environment variables with placeholder values, one set each for development and production.

## Development plan

The following are possible next steps in the development of the code base. Pull requests are welcome for these and any other potential improvements.

- allow for multiple `WHERE` clause conditions and the full range of operators
- enable the use of `OFFSET` and `LIMIT` and the ordering of rows returned
- add additional query types

## Repository tree

```shell
./
├── config
│   └── index.js
├── db
│   ├── crud.js
│   ├── index.js
│   ├── pool.js
│   └── table.js
├── test
│   ├── db
│   │   ├── crud.test.js
│   │   ├── db.test.js
│   │   └── table.test.js
│   └── utils
│       ├── format.test.js
│       └── utils.test.js
├── utils
│   ├── format.js
│   └── index.js
├── .env
├── .gitignore
├── LICENSE.txt
├── README.md
├── package-lock.json
└── package.json
```
