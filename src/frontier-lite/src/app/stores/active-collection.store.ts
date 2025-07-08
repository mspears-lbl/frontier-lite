import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { FileSystemService } from '../services/file-system.service';
import { FeatureCollection, Feature } from 'geojson';

interface ActiveCollectionState {
    // count: number;
    // text: string;
    data: FeatureCollection | null | undefined;
}

const initialState: ActiveCollectionState = {
    // count: 0,
    // text: 'Initial',
    data: undefined
};

export const ActiveCollectionStore = signalStore(
    { providedIn: 'root' },
    withState(initialState), // Initial state
    // withComputed((store) => ({
    //     doubleCount: computed(() => store.count() * 2), // Derived values
    // })),
    withMethods((store) => {
        const fileSystemService = inject(FileSystemService);

        return {
            // increment: () => patchState(store, { count: store.count() + 1 }), // Methods to update state
            // setText: (text: string) => patchState(store, { text }),
            setData: (data: FeatureCollection) => {
                console.log('set the store data to:', data)
                patchState(store, { data });
            },
            addEquipment: (equipment: Feature) => {
                const currentData = store.data();
                if (currentData) {
                    // Create a new object instead of modifying the existing one
                    const newData: FeatureCollection = {
                        type: 'FeatureCollection',
                        features: [...currentData.features, equipment]
                    };
                    patchState(store, { data: newData });
                }
                else {
                    const data: FeatureCollection = {
                        type: 'FeatureCollection',
                        features: [equipment]
                    }
                    patchState(store, { data });
                }
                // Save the updated data
                fileSystemService.saveEquipmentFile(store.data()!);
            },
            removeEquipment: (id: string) => {
                const currentData = store.data();
                if (currentData) {
                    // Create a new object instead of modifying the existing one
                    const newData: FeatureCollection = {
                        type: 'FeatureCollection',
                        features: currentData.features.filter((feature) => feature.id !== id)
                    };
                    patchState(store, { data: newData });
                }
                // Save the updated data
                fileSystemService.saveEquipmentFile(store.data()!);
            }
        };
    })
);
