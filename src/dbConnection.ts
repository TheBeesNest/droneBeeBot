import { DataSource } from 'typeorm';

export const dbSource = new DataSource({
	type: 'mysql',
	host: process.env.dbHost,
	port: Number(process.env.dbPort),
	database: process.env.database,
	username: process.env.dbUsername,
	password: process.env.dbPassword,
	entities: ['entity/*.js'],
	migrations: ['migration/*.js'],

})