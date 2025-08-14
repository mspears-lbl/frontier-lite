import { EquipmentType, isEquipmentType } from "./equipment-type";
import { FeatureCollection, Feature } from 'geojson';

export interface Equipment {
    id: string;
    equipmentType: EquipmentType;
    name: string;
    geo: Feature;
    created: Date;
}

export function isValidEquipment(value: any): value is Equipment {
    return (
        value &&
        typeof value.id === 'string' &&
        isEquipmentType(value.equipmentType) &&
        typeof value.name === 'string' &&
        value.name.trim().length > 0 &&
        typeof value.geo === 'object'
    );
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

export interface AddEquipmentResult {
    success: boolean;
    error?: any;
}

export interface UpdateResult {
    success: boolean;
    error?: any;
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
