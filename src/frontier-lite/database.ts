import Database from 'better-sqlite3';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { v4 } from 'uuid'
import { AddEquipmentParams, Equipment, EquipmentCollection } from './src/app/models/equipment';
import queries from './queries';
import { AddAnalysisProjectParams, AddProjectThreatRequest, AddProjectThreatStrategyParams, AddRecordResult, AnalysisProject, AnalysisProjectData, ProjectThreat, ProjectThreatStrategy, ProjectThreatUpdateParams } from './src/app/analysis/models/analysis-project';
import { ResilienceStrategyType } from './src/app/analysis/models/resilience-strategy';

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

    public updateEquipment(params: Equipment): Database.RunResult {
        const stmt = this.db.prepare(queries['update-equipment']);
        const stringParams = {
            ...params,
            geo: JSON.stringify(params.geo)
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

    public getEquipmentById(equipmentId: string): Equipment {
        const stmt = this.db.prepare(queries['get-equipment-by-id']);
        const results = stmt.get({equipmentId}) as any;
        console.log(`get equiopment by id ${equipmentId} results...`);
        console.log(results);
        return {
            ...results,
            geo: JSON.parse(`${results.geo}`)
        };
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

    public getProjects(): AnalysisProject[] {
        const stmt = this.db.prepare(queries['get-projects']);
        return stmt.all() as AnalysisProject[];
    }

    public getProject(id: string): AnalysisProjectData {
        const stmt = this.db.prepare(queries['get-project']);
        stmt.bind({id})
        const results = stmt.get() as any;
        console.log('get project results...');
        console.log(results);
        const trans = {
            ...results,
            threats: JSON.parse(results.threats)
        };
        if (trans.threats && Array.isArray(trans.threats)) {
            console.log('yes threats is array...')
            let threats = [];
            for (let threat of trans.threats) {
                if (threat.strategies) {
                    console.log('strategies exists...');
                    // console.log(threat.strategies);
                    const strategies = JSON.parse(threat.strategies);
                    for (let strategy of strategies) {
                        if (strategy.data) {
                            strategy.data = JSON.parse(strategy.data);
                        }
                    }
                    threats.push({
                        ...threat,
                        strategies
                    })
                }
                else {
                    threats.push(threat);
                }
            }
            trans.threats = threats;
        }
        return trans;
    }

    public addProject(params: AddAnalysisProjectParams): Database.RunResult {
        const uuid = v4();
        const stmt = this.db.prepare(queries['insert-project']);
        return stmt.run({
            ...params,
            uuid
        });
    }

    public addProjectThreat(params: AddProjectThreatRequest): Database.RunResult {
        const uuid = v4();
        const stmt = this.db.prepare(queries['insert-project-threat']);
        console.log('add project threat params...');
        console.log({
            ...params,
            uuid
        });
        return stmt.run({
            ...params,
            uuid
        });
    }

    public updateProjectThreat(params: ProjectThreatUpdateParams): Database.RunResult {
        const stmt = this.db.prepare(queries['update-project-threat']);
        console.log('update project threat params...');
        console.log(params);
        return stmt.run({
            id: params.id,
            name: params.name,
            description: params.description,
            threatType: params.threatType
        });
    }


    public addThreatStrategies(params: AddProjectThreatStrategyParams[]): Database.RunResult[] {
        interface Params {
            name: string;
            threatId: string;
            equipmentId: string;
            strategyType: ResilienceStrategyType;
            data: string;
        }
        const queryParams: Params[] = params.map(item => ({
            name: item.name,
            threatId: item.threatId,
            equipmentId: item.equipmentId,
            strategyType: item.strategyType,
            data: JSON.stringify(item.data)
        }))
        const results = queryParams.map(queryParam => {
            const stmt = this.db.prepare(queries['insert-threat-equipment']);
            return stmt.run(queryParam);
        })
        return results;
    }

    public updateThreatStrategy(params: ProjectThreatStrategy): Database.RunResult {
        const queryParams = {
            id: params.id,
            name: params.name,
            data: JSON.stringify(params.data)
        }
        const stmt = this.db.prepare(queries['update-threat-equipment']);
        return stmt.run(queryParams);
    }

    public deleteThreatStrategy(id: number): Database.RunResult {
        const stmt = this.db.prepare(queries['delete-threat-strategy']);
        return stmt.run({ id });
    }

    public deleteProjectThreat(id: string): Database.RunResult {
        const stmt = this.db.prepare(queries['delete-project-threat']);
        return stmt.run({ id });
    }



    public deleteProject(id: string): Database.RunResult {
        const stmt = this.db.prepare(queries['delete-project']);
        return stmt.run({id});
    }

    public close(): void {
        this.db.close();
    }
}
