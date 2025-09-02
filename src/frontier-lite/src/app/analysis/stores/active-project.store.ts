import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { deepCopy } from '../../models/deep-copy';
import { AddProjectThreatRequest, AnalysisProject, AnalysisProjectData } from '../models/analysis-project';

interface ActiveProjectState {
    data: AnalysisProjectData | null | undefined;
}

const initialState: ActiveProjectState = {
    data: undefined
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
                patchState(store, { data });
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
                    patchState(store, { data });
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
                    patchState(store, { data });
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
                    patchState(store, { data });
                }
                return results;
            },
            // removeProject: async (id: string) => {
            //     await dbService.deleteProject(id);
            //     const results = await dbService.getProjects();
            //     patchState(store, { data: results.data });
            // }
        };
    })
);
