import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { deepCopy } from '../../models/deep-copy';
import { EquipmentCollection } from '../../models/equipment';

interface EquipmentCollectionState {
    data: EquipmentCollection[] | null | undefined;
}

const initialState: EquipmentCollectionState = {
    // count: 0,
    // text: 'Initial',
    data: undefined
};

export const EquipmentCollectionStore = signalStore(
    { providedIn: 'root' },
    withState(initialState), // Initial state
    // withComputed((store) => ({
    //     doubleCount: computed(() => store.count() * 2), // Derived values
    // })),
    withMethods((store) => {
        const dbService = inject(DatabaseService);

        return {
            // increment: () => patchState(store, { count: store.count() + 1 }), // Methods to update state
            // setText: (text: string) => patchState(store, { text }),
            setData: (data: EquipmentCollection[]) => {
                console.log('set the store data to:', data)
                patchState(store, { data: deepCopy(data) });
            },
            clearData: () => {
                patchState(store, {data: undefined});
            },
            loadData: async () => {
                const results = await dbService.getEquipmentCollections();
                const data = results?.data
                    ? deepCopy(results.data)
                    : undefined;
                patchState(store, { data });
            },
            // removeEquipment: (id: string) => {
            //     const currentData = store.data();
            //     if (currentData) {
            //         // Create a new object instead of modifying the existing one
            //         const newData: FeatureCollection = {
            //             type: 'FeatureCollection',
            //             features: currentData.features.filter((feature) => feature.id !== id)
            //         };
            //         patchState(store, { data: newData });
            //     }
            //     // Save the updated data
            //     dbService.saveEquipmentFile(store.data()!);
            // }
        };
    })
);
