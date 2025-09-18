import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { deepCopy } from '../../models/deep-copy';
import { AddProjectThreatRequest, AddProjectThreatStrategyParams, AnalysisProject, AnalysisProjectData, ProjectThreat, ProjectThreatStrategy, ProjectThreatUpdateParams } from '../models/analysis-project';
import { ProjectCalcResults, ProjectCalculator } from '../models/project-calculator';

interface ActiveProjectState {
    data: AnalysisProjectData | null | undefined;
    calcs: ProjectCalcResults | null | undefined;
}

const initialState: ActiveProjectState = {
    data: undefined,
    calcs: undefined
};

export const ActiveProjectStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => {
        const dbService = inject(DatabaseService);

        const getData = async(id: string): Promise<AnalysisProjectData> => {
            console.log(`load the data for analysis project ${id}`);
            const results = await dbService.getProject(id);
            console.log('done');
            console.log(results);
            if (results.data) {
                return deepCopy(results.data);
            }
            else {
                throw new Error('Unable to retrieve project')
            }
        }

        return {
            // setData: (data: AnalysisProject[]) => {
            //     console.log('set the store data to:', data)
            //     patchState(store, { data: deepCopy(data) });
            // },
            clearData: () => {
                patchState(store, {data: undefined});
            },
            loadData: async (id: string) => {
                console.log(`load analysis project ${id}...`)
                const results = await getData(id);
                console.log(`project ${id} loaded`);
                console.log(results);
                const data = results
                    ? deepCopy(results)
                    : undefined;
                const calcs = data
                    ? ProjectCalculator.run(data.threats)
                    : undefined;
                patchState(store, { data, calcs });
                return data;
            },
            reloadData: async () => {
                const current = store.data();
                if (current?.id) {
                    const results = await getData(current.id);
                    console.log(`project ${current.id} loaded`);
                    console.log(results);
                    const data = results
                        ? deepCopy(results)
                        : undefined;
                    const calcs = data
                        ? ProjectCalculator.run(data.threats)
                        : undefined;
                    patchState(store, { data, calcs });
                }
            },
            addThreat: async (params: AddProjectThreatRequest) => {
                console.log('add threat to project...');
                console.log(params);
                const results = await dbService.addProjectThreat(params);
                console.log('done');
                console.log(results);
                if (results.success) {
                    const data = await getData(params.projectId);
                    const calcs = data
                        ? ProjectCalculator.run(data.threats)
                        : undefined;
                    patchState(store, { data, calcs });
                }
                return results;
            },
            updateThreat: async (params: ProjectThreatUpdateParams) => {
                console.log('update threat...');
                console.log(params);
                const results = await dbService.updateProjectThreat(params);
                console.log('done');
                console.log(results);
                if (results.success) {
                    const current = store.data();
                    if (current?.id) {
                        const data = await getData(current.id);
                        const calcs = data
                            ? ProjectCalculator.run(data.threats)
                            : undefined;
                        patchState(store, { data, calcs });
                    }
                }
                return results;
            },
            removeThreat: async (id: string) => {
                const current = store.data();
                const results = await dbService.deleteProjectThreat(id);
                if (results.success && current?.id) {
                    const results = await getData(current.id);
                    const data = results
                        ? deepCopy(results)
                        : undefined;
                    const calcs = data
                        ? ProjectCalculator.run(data.threats)
                        : undefined;
                    patchState(store, { data, calcs });
                }
                return results;
            },
            addThreatStrategies: async (params: AddProjectThreatStrategyParams[]) => {
                const current = store.data();
                const results = await dbService.addThreatStrategies(params)
                if (results.success && current?.id) {
                    const results = await getData(current.id);
                    const data = results
                        ? deepCopy(results)
                        : undefined;
                    const calcs = data
                        ? ProjectCalculator.run(data.threats)
                        : undefined;
                    patchState(store, { data, calcs });
                }
                return results;

            },
            removeThreatStrategy: async (id: number) => {
                const current = store.data();
                const results = await dbService.deleteThreatStrategy(id);
                if (results.success && current?.id) {
                    const results = await getData(current.id);
                    const data = results
                        ? deepCopy(results)
                        : undefined;
                    const calcs = data
                        ? ProjectCalculator.run(data.threats)
                        : undefined;
                    patchState(store, { data, calcs });
                }
                return results;
            },
            updateThreatStrategy: async (params: ProjectThreatStrategy) => {
                const current = store.data();
                const results = await dbService.updateThreatStrategy(params)
                if (results.success && current?.id) {
                    const results = await getData(current.id);
                    const data = results
                        ? deepCopy(results)
                        : undefined;
                    const calcs = data
                        ? ProjectCalculator.run(data.threats)
                        : undefined;
                    patchState(store, { data, calcs });
                }
                return results;

            },
        };
    })
);
