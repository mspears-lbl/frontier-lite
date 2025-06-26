import {QueryFile, IQueryFileOptions} from 'pg-promise';

export function sqlLoader(fullPath: string): QueryFile {
    const options: IQueryFileOptions = {

        // minifying the SQL is always advised;
        // see also option 'compress' in the API;
        minify: true,

        // Showing how to use static pre-formatting parameters -
        // we have variable 'schema' in each SQL (as an example);
        params: {
            schema: 'public' // replace ${schema~} with "public"
        }
    };

    const qf: QueryFile = new QueryFile(fullPath, options);
    console.log(`query file = ${fullPath}`)

    if (qf.error) {
        // Something is wrong with our query file :(
        // Testing all files through queries can be cumbersome,
        // so we also report it here, while loading the module:
        console.error(qf.error);
    }

    return qf;

        // See QueryFile API:
        // http://vitaly-t.github.io/pg-promise/QueryFile.html
}
