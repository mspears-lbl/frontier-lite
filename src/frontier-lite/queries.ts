import * as fs from 'fs';
import * as path from 'path';

function loadQueries(): { [key: string]: string } {
    const queries: { [key: string]: string } = {};
    const queriesDir = path.join(__dirname, 'queries');
    
    const queryFiles = fs.readdirSync(queriesDir).filter(file => file.endsWith('.sql'));
    queryFiles.forEach(file => {
        const queryName = path.basename(file, '.sql');
        const queryPath = path.join(queriesDir, file);
        queries[queryName] = fs.readFileSync(queryPath, 'utf8').trim();
    });
    
    return queries;
}

export default loadQueries();