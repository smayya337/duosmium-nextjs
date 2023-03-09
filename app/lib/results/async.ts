// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { generateFilename, MONGO_ID_REGEX } from './helpers';
import { addSchoolsFromInterpreter } from '@/app/lib/schools/async';
import { ObjectId } from 'mongodb';
import { db } from '@/app/lib/database';
import { dump, load } from 'js-yaml';

export async function getResult(id: string): Promise<object> {
	if (MONGO_ID_REGEX.test(id)) {
		return getResultByMongoID(new ObjectId(id));
	} else {
		return getResultByDuosmiumID(id);
	}
}

export async function resultExists(id: string): Promise<boolean> {
	if (MONGO_ID_REGEX.test(id)) {
		return resultExistsByMongoID(new ObjectId(id));
	} else {
		return resultExistsByDuosmiumID(id);
	}
}

export async function deleteResult(id: string) {
	if (MONGO_ID_REGEX.test(id)) {
		return deleteResultByMongoID(new ObjectId(id));
	} else {
		return deleteResultByDuosmiumID(id);
	}
}

async function getResultByDuosmiumID(duosmiumID: string): Promise<object> {
	const matches = await db.collection('results').find({ duosmium_id: duosmiumID });
	const arr = await matches.toArray();
	if (arr.length < 1) {
		throw new Error('No result found!');
	}
	return arr[0]['result'];
}

async function resultExistsByDuosmiumID(duosmiumID: string): Promise<boolean> {
	return (await db.collection('results').countDocuments({ duosmium_id: duosmiumID })) > 0;
}

async function deleteResultByDuosmiumID(duosmiumID: string) {
	await db.collection('results').deleteOne({ duosmium_id: duosmiumID });
}

async function getResultByMongoID(mongoID: ObjectId): Promise<object> {
	const matches = await db.collection('results').find({ _id: mongoID });
	const arr = await matches.toArray();
	if (arr.length < 1) {
		throw new Error('No result found!');
	}
	return arr[0]['result'];
}

async function resultExistsByMongoID(mongoID: ObjectId): Promise<boolean> {
	return (await db.collection('results').countDocuments({ _id: mongoID })) > 0;
}

async function deleteResultByMongoID(mongoID: ObjectId) {
	await db.collection('results').deleteOne({ _id: mongoID });
}

export async function getAllResults(): Promise<object> {
	const matches = await db.collection('results').find();
	const matchObject: object = {};
	let arr = await matches.toArray();
	arr = arr.sort((a, b) => (a['duosmium_id'] > b['duosmium_id'] ? 1 : -1));
	for (const arrElement of arr) {
		// @ts-ignore
		matchObject[arrElement['duosmium_id']] = arrElement['result'];
	}
	return matchObject;
}

export async function addResultFromYAMLFile(file: File) {
	const yaml = await file.text();
	const obj = load(yaml);
	await addResult(yaml, obj);
}

export async function addResultFromObject(obj: object) {
	const yaml = dump(obj);
	await addResult(yaml, obj);
}

async function addResult(yaml: string, obj: object | unknown) {
	let interpreter;
	try {
		interpreter = new Interpreter(yaml);
	} catch (e) {
		throw new Error('The uploaded data is not valid SciolyFF!');
	}
	const fileName = generateFilename(interpreter);
	const collection = db.collection('results');
	await collection.createIndex({ duosmium_id: 1 }, { unique: true });
	if (await resultExistsByDuosmiumID(fileName)) {
		await collection.updateOne(
			{
				duosmium_id: fileName
			},
			{
				$set: {
					result: obj
				}
			}
		);
	} else {
		await collection.insertOne({
			duosmium_id: fileName,
			result: obj
		});
	}
	await addSchoolsFromInterpreter(interpreter);
	return fileName;
}

export async function deleteAllResults() {
	await db.collection('results').drop();
}
