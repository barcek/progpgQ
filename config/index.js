/*
    Requirements
*/

require('dotenv').config();

/*
    Environment variable destructuring
*/

const {
    NODE_ENV = 'development',
    DATABASE_DEV_USER,
    DATABASE_DEV_PASS,
    DATABASE_DEV_HOST,
    DATABASE_DEV_PORT,
    DATABASE_DEV_NAME,
    DATABASE_PROD_USER,
    DATABASE_PROD_PASS,
    DATABASE_PROD_HOST,
    DATABASE_PROD_PORT,
    DATABASE_PROD_NAME
} = process.env;

/*
    Exports
*/

const IN_PROD = NODE_ENV === 'production' ? true : false;

module.exports = {
    DB: {
        USER: IN_PROD ? DATABASE_PROD_USER : DATABASE_DEV_USER,
        PASS: IN_PROD ? DATABASE_PROD_PASS : DATABASE_DEV_PASS,
        HOST: IN_PROD ? DATABASE_PROD_HOST : DATABASE_DEV_HOST,
        PORT: IN_PROD ? DATABASE_PROD_PORT : DATABASE_DEV_PORT,
        NAME: IN_PROD ? DATABASE_PROD_NAME : DATABASE_DEV_NAME
    }
};
