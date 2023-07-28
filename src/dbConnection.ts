import 'dotenv/config';
import { DataSource } from 'typeorm';

const dbSource = new DataSource({
	type: 'mysql',
	host: process.env.dbHost,
	port: Number(process.env.dbPort),
	database: process.env.database,
	username: process.env.dbUsername,
	password: process.env.dbPassword,
	entities: ['src/entity/*.ts'],
	migrations: ['src/migration/*.ts'],

})

export default dbSource;