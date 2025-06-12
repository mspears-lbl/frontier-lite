import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { FeatureCollection } from '../models/geojson.interface';

interface ActiveCollectionState {
    count: number;
    text: string;
    data: FeatureCollection | null | undefined;
}

const initialState: ActiveCollectionState = {
    count: 0,
    text: 'Initial',
    data: undefined
};

export const ActiveCollectionStore = signalStore(
    withState(initialState), // Initial state
    withComputed((store) => ({
        doubleCount: computed(() => store.count() * 2), // Derived values
    })),
    withMethods((store) => ({
        increment: () => patchState(store, { count: store.count() + 1 }), // Methods to update state
        setText: (text: string) => patchState(store, { text }),
        setData: (data: FeatureCollection) => patchState(store, { data })
    }))
);
