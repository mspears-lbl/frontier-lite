
export interface AppListItem<T> {
	readonly id: T;
	readonly name: string;

}

export type AppList<T> = readonly AppListItem<T>[];

/**
 * A generic function that retrieves an AppListItem with the given id,
 * from the given AppList.
 * @param list The AppList to search
 * @param id The id of the AppListItem to retrieve
 * @returns The AppListItem with the given id
 */
export function getAppListItemById<T>(list: AppList<T>, id: T): AppListItem<T> {
	const item = list.find(i => i.id === id);
	if (!item) {
		throw new Error(`Item with id ${id} not found in list`);
	}
	return item;
}

/**
 * A generic function that retrieves the name of an AppListItem with the given id,
 * from the given AppList.
 * @param list The AppList to search
 * @param id The id of the AppListItem to retrieve
 * @returns The name of the AppListItem with the given id
 */
export function getAppListNameById<T>(list: AppList<T>, id: T): string {
	const item = list.find(i => i.id === id);
	if (!item) {
		throw new Error(`Item with id ${id} not found in list`);
	}
	return item.name;
}

/**
 * A generic function that retrieves the id of an AppListItem with the given name,
 * from the given AppList.
 * @param list The AppList to search
 * @param name The name of the AppListItem to retrieve
 * @returns The id of the AppListItem with the given name
 */
export function getAppListIdByName<T>(list: AppList<T>, name: string): T {
	const item = list.find(i => i.name === name);
	if (!item) {
		throw new Error(`Item with name ${name} not found in list`);
	}
	return item.id;
}
