import { AppList, getAppListItemById } from "./app-list";

/** The IDs of the various types of GenerationEquipment */
export enum EquipmentType {
	GenerationAsset=1,
	TransmissionLine=2,
	Substation=3,
	DistributionLine=4,
	OtherCriticalFacility=5
}

/**
 * The maplibre draw modes available for the equipment types.
 */
export enum DrawMode {
    Point='point',
    LineString='linestring',
}

/**
 * Retrieve the maplibre draw mode for the given equipment type.
 */
export function getEquipmentTypeDrawMode(value: EquipmentType): DrawMode {
    switch (value) {
        case EquipmentType.GenerationAsset:
            return DrawMode.Point;
        case EquipmentType.TransmissionLine:
            return DrawMode.LineString;
        case EquipmentType.Substation:
            return DrawMode.Point;
        case EquipmentType.OtherCriticalFacility:
            return DrawMode.Point;
        default:
            return DrawMode.Point;
    }
}

/** Determines if the given value is a valid EquipmentType */
export function isEquipmentType(value: any): value is EquipmentType {
	return typeof value === 'number' && value in EquipmentType
		? true : false;
}

export const equipmentTypesList: AppList<EquipmentType> = [
	{id: EquipmentType.GenerationAsset, name: 'Generation Asset'},
	{id: EquipmentType.TransmissionLine, name: 'Transmission Line'},
	{id: EquipmentType.Substation, name: 'Substation'},
	{id: EquipmentType.OtherCriticalFacility, name: 'Other Critical Facilities'},
];

/**
 * Retrieves the name of the given EquipmentType
 * @param value The EquipmentType to get the name of
 * @returns The name of the given EquipmentType
 */
export function getEquipmentTypeName(value: EquipmentType): string {
    return getAppListItemById(equipmentTypesList, value).name;
}
