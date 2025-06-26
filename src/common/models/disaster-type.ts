import { AppList, getAppListItemById } from './app-list';

export enum DisasterType {
	EarthQuake=1,
	Tsunami=2,
	Typhoon=3,
	Wildfire=4,
	SeaLevelRise=5,
	Landslide=6
}

/** Determines if the given object is a valid DisasterType */
export function isDisasterType(value: any): value is DisasterType {
	return typeof value === 'number' && value in DisasterType
		? true : false;
}

export const disasterList: AppList<DisasterType> = [
	{id: DisasterType.EarthQuake, name: 'Earthquake'},
	{id: DisasterType.Tsunami, name: 'Tsunami'},
	{id: DisasterType.Typhoon, name: 'Typhoon'},
	{id: DisasterType.Wildfire, name: 'Wildfire'},
	{id: DisasterType.SeaLevelRise, name: 'Sea Level Rise'},
	{id: DisasterType.Landslide, name: 'Landslide'},
];


/**
 * Retrieve the name of the given disaster type.
 */
export function getDisasterName(id: DisasterType): string {
    const item = getAppListItemById(disasterList, id)
    return item.name;
}
