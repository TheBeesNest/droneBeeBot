import 'dotenv/config';
import { DataSource } from 'typeorm';

const productionUpdater = new DataSource({
	type: 'mysql',
	host: process.env.STAGING_dbHost,
	port: Number(process.env.STAGING_dbPort),
	database: process.env.STAGING_database,
	username: process.env.STAGING_dbUsername,
	password: process.env.STAGING_dbPassword,
	entities: ['src/entity/*.ts'],
	migrations: ['src/migration/*.ts'],

})

export default productionUpdater;