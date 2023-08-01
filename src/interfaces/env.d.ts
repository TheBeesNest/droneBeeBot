declare namespace NodeJS{
	interface ProcessEnv{
		botApiToken: string;
		clientId: string;
		guildId: string;
		dbHost: string;
		dbPort: string;
		database: string;
		dbUsername: string;
		dbPassword: string;
		welcome_channel: string;
	}
}