import { MongoClient } from 'mongodb';

let dbURI;
if (process.env.DB_HOST === undefined) {
	throw new Error('Database host not specified!');
} else if (process.env.DB_USERNAME === undefined) {
	throw new Error('Database username not specified!');
} else {
	const dbHost = process.env.DB_HOST;
	const dbUsername = process.env.DB_USERNAME;
	const dbPassword = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : '';
	const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 27017;
	dbURI = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/?retryWrites=true&w=majority`;
}

const client = await new MongoClient(dbURI).connect();

if (process.env.DB_DATABASE === undefined) {
	throw new Error('Database not specified!');
}
export const db = client.db(process.env.DB_DATABASE); // select database
