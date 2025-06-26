
export class DateFunctions {
	
	public static dateFromEpoch(epoch: number): Date {
		const date = new Date(0);
		date.setUTCSeconds(epoch);
		return date;
	}

	public static localDateFromEpoch(epoch: number): Date {
		const date = new Date(0);
		date.setUTCSeconds(epoch);
		return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
	}

	public static localDateFromYear(year: number): Date {
		const date = new Date(0);
		date.setUTCFullYear(year);
		return date;
	}

	/**
	 * Creates the epoch date numerical value for given date string in the format M/D/YYYY.
	 * @param dateString A date string in the format M/D/YYYY.
	 * @returns The epoch date value in seconds.
	 */
	public static epochFromString(dateString: string): number {
		if (!dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
			throw new Error(`Invalid date format: ${dateString}`);
		}
		const dateParts = dateString.split('/');
		return Date.UTC(+dateParts[2], +dateParts[0]-1, +dateParts[1]) / 1000;
	}

	public static epochFromYear(year: number): number {
		return Date.UTC(year, 0)
	}

	public static localDateToUTC(date: Date): number {
		return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000;
	}

	public static epochToFormattedDateTime(epoch: number): string {
		const date = DateFunctions.dateFromEpoch(epoch);
		return `${date.toLocaleDateString('en-US', {timeZone: 'America/Los_Angeles'})} ${date.toLocaleTimeString('en-US', {timeZone: 'America/Los_Angeles', timeZoneName: 'short'})}`;
	}
}
