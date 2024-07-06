import 'dotenv/config';
import { DataSource } from 'typeorm';

const productionUpdater = new DataSource({
	type: 'mysql',
	host: process.env.PROD_dbHost,
	port: Number(process.env.PROD_dbPort),
	database: process.env.PROD_database,
	username: process.env.PROD_dbUsername,
	password: process.env.PROD_dbPassword,
	entities: ['src/entity/*.ts'],
	migrations: ['src/migration/*.ts'],
});

export default productionUpdater;
