import { EquipmentType, isEquipmentType } from "./equipment-type";
import { Feature, FeatureCollection } from "./geojson.interface";

export interface Equipment {
    id: number;
    equipmentType: EquipmentType;
    name: string;
    geo: Feature;
    created: Date;
}

export interface CreateEquipmentCollectionRequest {
    name: string;
}

export interface EquipmentCollection {
    id: string;
    name: string;
    created: Date;
}

export interface EquipmentCollectionData extends EquipmentCollection {
    data: Equipment[];
}

export interface AddEquipmentParams {
    collectionId: string;
    equipmentType: EquipmentType;
    name: string;
    geo: Feature;
}

export function isAddEquipmentParams(value: any): value is AddEquipmentParams {
    return (
        value &&
        typeof value.collectionId === 'string' &&
        isEquipmentType(value.equipmentType) &&
        typeof value.name === 'string' &&
        typeof value.geo === 'object'
    );
}

export function buildFeatureCollection(collection: EquipmentCollectionData): FeatureCollection {
    return {
        type: 'FeatureCollection',
        features: collection.data.map((e: Equipment) => e.geo)
    };
}
