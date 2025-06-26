import * as path from 'path';
import { db, sqlLoader } from '../db';

export abstract class AppQuery {
    protected query: any;

    protected abstract buildQuery(...params: any): void;

    constructor() {
    }

    public abstract run(...params: any[]): Promise<any>;

    protected runQueryNone(params?: any, transaction?: any): Promise<any> {
        const ctx = transaction || db;
        return ctx.none(this.query, params)
            // .catch((error: any) => {
            //     throw new WelderDbError({query: this.query.toString()}, error as Error)
            // });
    }

    protected runQuerySingle(params?: any, transaction?: any): Promise<any> {
        const ctx = transaction || db;
        return ctx.one(this.query, params)
            // .catch((error: any) => {
            //     throw new WelderDbError({query: this.query.toString()}, error as Error)
            // });
    }

    protected runQuerySingleOrNone(params?: any, transaction?: any): Promise<any> {
        const ctx = transaction || db;
        return ctx.oneOrNone(this.query, params)
            // .catch((error: any) => {
            //     throw new WelderDbError({query: this.query.toString()}, error as Error)
            // });
    }

    protected runQueryMany(params?: any, transaction?: any): Promise<any> {
        const ctx = transaction || db;
        return ctx.many(this.query, params)
            // .catch((error: any) => {
            //     throw new WelderDbError({query: this.query.toString()}, error as Error)
            // });
    }

    protected runQueryManyOrNone(params?: any, transaction?: any): Promise<any> {
        const ctx = transaction || db;
        return ctx.manyOrNone(this.query, params)
            // .catch((error: any) => {
            //     throw new WelderDbError({query: this.query.toString()}, error as Error)
            // });
    }

    protected runQueryManyOrNoneArray(params?: Array<any>, transaction?: any): Promise<any> {
        const ctx = transaction || db;
        return ctx.query({
            text: this.query,
            values: params,
            rowMode: 'array'
        })
        // .catch((error: any) => {
        //     throw new WelderDbError({query: this.query.toString()}, error as Error)
        // });
    }

    /**
     * Run a query to delete a record.
     * @param [params] 
     * @param [transaction] 
     * @returns number of records deleted.
     */
    protected runQueryDelete(params?: any, transaction?: any): Promise<number> {
        const ctx = transaction || db;
        return ctx.result( this.query, params, (r: any) => r.rowCount)
        //     .catch((error: any) => {
        //         throw new WelderDbError({query: this.query.toString()}, error as Error)
        //     });
    }

    protected runQueryNumAffected(params?: any, transaction?: any): Promise<number> {
        const ctx = transaction || db;
        return ctx.result(this.query, params, (r: any) => r.rowCount)
            // .catch((error: any) => {
            //     throw new WelderDbError({query: this.query.toString()}, error as Error)
            // });
    }
}


export abstract class AppFileQuery extends AppQuery {
    constructor(dirName: string, fileName: string) {
        super();
        this.buildQuery(dirName, fileName);
    }

    protected buildQuery(dirName: string, fileName: string): void {
        this.query = sqlLoader(path.join(dirName, fileName));
    }

}
