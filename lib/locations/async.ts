import { db } from '@/lib/global/drizzle';
import { locations } from '@/lib/global/schema';

export async function addLocation(locationData: object, tx=db) {
	// @ts-ignore
	return (await tx.insert(locations).values(locationData).onConflictDoNothing().returning())[0];
}

export async function createLocationDataInput(
	name: string,
	state: string,
	city = '',
	country = 'United States'
) {
	return {
		name: name,
		city: city,
		state: state,
		country: country
	};
}
