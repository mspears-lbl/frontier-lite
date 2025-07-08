import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { deepCopy } from '../../models/deep-copy';
import { AnalysisProject } from '../models/analysis-project';

interface AnalysisProjectState {
    data: AnalysisProject[] | null | undefined;
}

const initialState: AnalysisProjectState = {
    data: undefined
};

export const AnalysisProjectStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => {
        const dbService = inject(DatabaseService);

        return {
            setData: (data: AnalysisProject[]) => {
                console.log('set the store data to:', data)
                patchState(store, { data: deepCopy(data) });
            },
            clearData: () => {
                patchState(store, {data: undefined});
            },
            loadData: async () => {
                console.log('load projects...')
                const results = await dbService.getProjects();
                console.log('load projects done');
                console.log(results);
                const data = results?.data
                    ? deepCopy(results.data)
                    : undefined;
                patchState(store, { data });
            },
            removeProject: async (id: string) => {
                await dbService.deleteProject(id);
                const results = await dbService.getProjects();
                patchState(store, { data: results.data });
            }
        };
    })
);
