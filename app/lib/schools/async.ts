// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { fullSchoolName } from './helpers';
import type { ObjectId } from 'mongodb';
import { generateFilename } from '@/app/lib/results/helpers';
import { db } from '@/app/lib/database';

export async function getSchoolByName(
	name: string,
	city: string | null,
	state: string
): Promise<object> {
	const matches = await db.collection('schools').find({ name: name, city: city, state: state });
	const arr = await matches.toArray();
	if (arr.length < 1) {
		throw new Error('No school found!');
	}
	return arr[0];
}

export async function schoolExistsByName(
	name: string,
	city: string | null,
	state: string
): Promise<boolean> {
	return (
		(await db.collection('schools').countDocuments({ name: name, city: city, state: state })) > 0
	);
}

export async function getSchoolByFullName(fullName: string): Promise<object> {
	const matches = await db.collection('schools').find({ full_name: fullName });
	const arr = await matches.toArray();
	if (arr.length < 1) {
		throw new Error('No school found!');
	}
	return arr[0];
}

export async function schoolExistsByFullName(fullName: string): Promise<boolean> {
	return (await db.collection('schools').countDocuments({ full_name: fullName })) > 0;
}

export async function deleteSchoolByFullName(fullName: string) {
	await db.collection('schools').deleteOne({ full_name: fullName });
}

export async function getSchoolByMongoID(mongoID: ObjectId): Promise<object> {
	const matches = await db.collection('schools').find({ _id: mongoID });
	const arr = await matches.toArray();
	if (arr.length < 1) {
		throw new Error('No school found!');
	}
	return arr[0];
}

export async function schoolExistsByMongoID(mongoID: ObjectId): Promise<boolean> {
	return (await db.collection('schools').countDocuments({ _id: mongoID })) > 0;
}

export async function deleteSchoolByMongoID(mongoID: ObjectId) {
	await db.collection('schools').deleteOne({ _id: mongoID });
}

export async function getAllSchools(): Promise<object> {
	const matches = await db.collection('schools').find();
	const matchObject: object = {};
	let arr = await matches.toArray();
	arr = arr.sort((a, b) => (a['state'] > b['state'] ? 1 : -1));
	arr = arr.sort((a, b) => (a['city'] > b['city'] ? 1 : -1));
	arr = arr.sort((a, b) => (a['name'] > b['name'] ? 1 : -1));
	for (const arrElement of arr) {
		// @ts-ignore
		matchObject[arrElement['full_name']] = arrElement;
	}
	return matchObject;
}

export async function addSchool(name: string, city: string | null, state: string) {
	const collection = db.collection('schools');
	await collection.createIndex({ full_name: 1 }, { unique: true });
	const schoolExists = await schoolExistsByName(name, city, state);
	if (schoolExists) {
		throw new Error('This school already exists!');
	} else {
		const fullName = fullSchoolName(name, city, state);
		await collection.insertOne({
			name: name,
			city: city,
			state: state,
			full_name: fullName,
			tournaments: []
		});
		return fullName;
	}
}

export async function addSchoolsFromInterpreter(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	for (const team of interpreter.teams) {
		const name = team.school;
		const city = team.city;
		const state = team.state;
		let school;
		try {
			school = await addSchool(name, city, state);
		} catch (e) {
			// do nothing
			school = fullSchoolName(name, city, state);
		}
		await addTournamentToSchool(school, duosmiumID);
	}
}

export async function handlePOSTedJSON(json: object) {
	// @ts-ignore
	await addSchool(json['name'], json['city'], json['state']);
}

async function addTournamentToSchool(school: string, duosmiumID: string) {
	const collection = db.collection('schools');
	const schoolExists = await schoolExistsByFullName(school);
	if (!schoolExists) {
		throw new Error('This school does not already exist!');
	} else {
		// @ts-ignore
		const tournaments: string[] = (await getSchoolByFullName(school))['tournaments'];
		if (!tournaments.includes(duosmiumID)) {
			await collection.updateOne(
				{
					full_name: school
				},
				{
					$push: {
						tournaments: {
							$each: [duosmiumID],
							$sort: 1
						}
					}
				}
			);
			return `Added ${duosmiumID} to ${school}`;
		} else {
			return `Did not add ${duosmiumID} to ${school} because it already exists`;
		}
	}
}

export async function deleteAllSchools() {
	await db.collection('schools').drop();
}
