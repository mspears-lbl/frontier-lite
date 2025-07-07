import Database from 'better-sqlite3';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { v4 } from 'uuid'
import { AddEquipmentParams, Equipment, EquipmentCollection } from './src/app/models/equipment';
import queries from './queries';

export class DatabaseService {
    private db: Database.Database;

    constructor() {
        const dbPath = path.join(app.getPath('userData'), 'frontier-lite.db');
        this.db = new Database(dbPath);
        this.initializeTables();
    }

    private initializeTables(): void {
        const schemaPath = path.join(__dirname, '..', 'database-schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        this.db.exec(schema);
    }

    public insertEquipment(params: AddEquipmentParams): Database.RunResult {
        const stmt = this.db.prepare(queries['insert-equipment']);
        const stringParams = {
            ...params,
            geo: JSON.stringify(params.geo),
            uuid: v4()
        }
        return stmt.run(stringParams);
    }

    public getEquipment(collectionId: string): Equipment[] {
        const stmt = this.db.prepare(queries['get-equipment']);
        const results = stmt.all({collectionId}) as Equipment[];
        console.log('get equiopment results...');
        console.log(results);
        return results.map(item => ({
            ...item,
            geo: JSON.parse(`${item.geo}`)
        }));
    }

    public deleteEquipment(id: string): Database.RunResult {
        const stmt = this.db.prepare(queries['delete-equipment']);
        return stmt.run({id});
    }

    /**
     * Determines if the given equipment collection name already exists.
     */
    public equipmentGroupNameExists(name: string): boolean {
        const stmt = this.db.prepare(queries['equipment-group-name-exists']);
        const result = stmt.get(name.trim()) as {count: number};
        return result.count > 0 ? true : false;
    }

    public insertEquipmentCollection(name: string): EquipmentCollection {
        const uuid = v4();
        const stmt = this.db.prepare(queries['insert-equipment-collection']);
        const result = stmt.run(name.trim(), uuid);

        // Get the inserted record
        const selectStmt = this.db.prepare(queries['get-equipment-collection-by-id']);
        const collection = selectStmt.get(result.lastInsertRowid) as EquipmentCollection;

        return {
            id: collection.id,
            name: collection.name,
            created: collection.created
        };
    }

    public getEquipmentCollections(): EquipmentCollection[] {
        const stmt = this.db.prepare(queries['get-equipment-collections']);
        return stmt.all() as EquipmentCollection[];
    }

    public deleteEquipmentCollection(id: string): Database.RunResult {
        const stmt = this.db.prepare(queries['delete-equipment-collection']);
        return stmt.run(id);
    }

    public close(): void {
        this.db.close();
    }
}
