import {IMain, IDatabase } from 'pg-promise';
import pgPromise from 'pg-promise';
// import * as promise from 'bluebird';
import { sqlLoader } from './sql_loader';
import { createLogger } from '../logging';
const logger = createLogger(module);

const pgp:IMain = pgPromise({
    // Set bluebird as the primise library
    // promiseLib: promise,
    // uncomment the 'query' function to display the queries as they're executed
    // query: function(e: any) {
    //     console.log('')
    //     console.log(e.query);
    //     console.log('')
    // }
});

pgp.pg.types.setTypeParser(20, parseInt); // Type Id 20 = BIGINT | BIGSERIAL
pgp.pg.types.setTypeParser(1700, parseFloat); // Type Id 1700 = numeric

// const cs = new pgp.helpers.ColumnSet(['col_a', 'col_b'], {table: 'tmp'});
// const cs = new pgp.helpers.ColumnSet(['col_a', 'col_b'], {table: {table: 'data_source_value', schema: 'app'}});

export function getColumnSet(columns: string[], schema: string, tableName: string): any {
    const options: pgPromise.IColumnSetOptions = {
        table: {
            table: tableName,
            schema
        }
    }
    return new pgp.helpers.ColumnSet(columns, options);
}

export function getQuery(values: any[], columnSet: any): any {
    return pgp.helpers.insert(values, columnSet);
}

// Build the connection string from environment variables
// if the UNDER_TEST env variable is set, use the test database.
// if (process.env.UNDER_TEST) {
//     logger.info('UNDER_TEST environment variable set... connecting to the test database');
// }
// const host = process.env.UNDER_TEST
//     ? process.env.PG_TEST_HOST
//     : process.env.PG_HOST;
// const port = process.env.UNDER_TEST
//     ? process.env.PG_TEST_PORT
//     : process.env.PG_PORT;

const host = process.env.PG_HOST;
const port = process.env.PG_PORT;
if (!host) {
    throw new Error(`PG_HOST not set`);
    
}
else if (!port) {
    throw new Error(`PG_PORT not set`);
}
console.log(`Connecting to ${host}:${port}`)

const db:IDatabase<any> = pgp({
    user: process.env.PG_DB_ADMIN_USER,
    password: process.env.PG_DB_ADMIN_PASS,
    host: host,
    port: Number(port),
    database: process.env.PG_DB_NAME,
    application_name: process.env.APP_NAME || 'app-api'
});

export {
    db,
    sqlLoader
}
