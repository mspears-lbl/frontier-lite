import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { computed, inject, effect } from '@angular/core';
import { EquipmentCollectionStore } from './equipment-collection.store';
import { DatabaseService } from '../../services/database.service';
import { deepCopy } from '../../models/deep-copy';
import { AddEquipmentParams, AddEquipmentResult, EquipmentCollection, EquipmentCollectionData } from '../../models/equipment';

interface ActiveEquipmentCollectionState {
    data: EquipmentCollectionData | null | undefined;
}

const initialState: ActiveEquipmentCollectionState = {
    // count: 0,
    // text: 'Initial',
    data: undefined
};

export const ActiveEquipmentCollectionStore = signalStore(
    { providedIn: 'root' },
    withState(initialState), // Initial state
    // withComputed((store) => ({
    //     doubleCount: computed(() => store.count() * 2), // Derived values
    // })),
    withMethods((store) => {
        const dbService = inject(DatabaseService);
        const equipmentCollectionStore = inject(EquipmentCollectionStore);

        const getCollectionData = async(collection: EquipmentCollection): Promise<EquipmentCollectionData> => {
            console.log(`get collection data for ${collection.name}`);
            const results = await dbService.getEquipment(collection.id);
            const params = {
                ...collection,
                data: results.data || []
            }
            console.log('done');
            console.log(params);
            return deepCopy(params);
        }
        // Listen for changes to EquipmentCollectionStore
        effect(async () => {
            const collections = equipmentCollectionStore.data();
            const current = store.data();
            if (collections && collections.length && !current) {
                // const results = await dbService.getEquipment(collections[0].id);
                // const params = {
                //     ...collections[0],
                //     data: results.data || []
                // }
                const data = await getCollectionData(collections[0])
                // set the active collection to the first item in the list
                patchState(store, {data})
            }
            else if (
                current &&
                collections?.find(item => item.id === current.id) == null
            ) {
                // reset the active equipment collection if it's not in the main array
                collections?.length
                    ? patchState(store, {data: await getCollectionData(collections[0])})
                    : patchState(store, {data: undefined});
            }
        });

        return {
            // increment: () => patchState(store, { count: store.count() + 1 }), // Methods to update state
            // setText: (text: string) => patchState(store, { text }),
            setData: async (data: EquipmentCollection) => {
                console.log('set the store data to:', data)
                patchState(store, { data: await getCollectionData(data) });
            },
            clearData: () => {
                patchState(store, {data: undefined});
            },
            addEquipment: async (params: AddEquipmentParams): Promise<AddEquipmentResult> => {
                const result = await dbService.insertEquipment(params);
                const current = store.data();
                if (current) {
                    patchState(store, { data: await getCollectionData(current) });
                }
                else {
                    patchState(store, {data: undefined});
                }
                return result;
            },
            // loadData: async () => {
            //     const results = await dbService.getActiveEquipmentCollections();
            //     const data = results?.data
            //         ? deepCopy(results.data)
            //         : undefined;
            //     patchState(store, { data });
            // }
            // addEquipment: (equipment: Feature) => {
            //     const currentData = store.data();
            //     if (currentData) {
            //         // Create a new object instead of modifying the existing one
            //         const newData: FeatureCollection = {
            //             type: 'FeatureCollection',
            //             features: [...currentData.features, equipment]
            //         };
            //         patchState(store, { data: newData });
            //     }
            //     else {
            //         const data: FeatureCollection = {
            //             type: 'FeatureCollection',
            //             features: [equipment]
            //         }
            //         patchState(store, { data });
            //     }
            //     // Save the updated data
            //     dbService.saveEquipmentFile(store.data()!);
            // },
            removeEquipment: async (id: string) => {
                await dbService.deleteEquipment(id);
                const current = store.data();
                if (current) {
                    patchState(store, { data: await getCollectionData(current) });
                }
                else {
                    patchState(store, {data: undefined});
                }
            }
        };
    })
);
