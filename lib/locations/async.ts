export async function createLocationDataInput(
	name: string,
	state: string,
	city = '',
	country = 'United States'
) {
	return {
		connectOrCreate: {
			where: {
				name_city_state_country: {
					name: name,
					city: city,
					state: state,
					country: country
				}
			},
			create: {
				name: name,
				city: city,
				state: state,
				country: country
			}
		}
	};
}
