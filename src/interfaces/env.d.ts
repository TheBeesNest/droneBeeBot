declare namespace NodeJS {
	interface ProcessEnv {
		botApiToken: string;
		clientId: string;
		guildId: string;
		dbHost: string;
		dbPort: string;
		database: string;
		dbUsername: string;
		dbPassword: string;
		welcome_channel: string;
		welcome_role: string;
		birthday_channel: string;
		S3_ACCESSKEY: string;
		S3_SECRET: string;
	}
}
