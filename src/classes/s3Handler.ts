import { randomUUID } from 'crypto';
import { Client } from 'minio';

export class S3Manager {
	private readonly minioClient: Client
	constructor() {
		this.minioClient = new Client({
			endPoint: 's3.amazonaws.com',
			accessKey: process.env.S3_ACCESSKEY as string,
			secretKey: process.env.S3_SECRET as string,
			region: 'eu-west-2',
		});
	}

	public async addImage(fileExtension: string, image: Buffer): Promise<string> {
		try {
			const filename = `${randomUUID()}.${fileExtension}`;
			await this.minioClient.putObject('discord-hive-media', filename, image);
			return filename;
		} catch (e) {
			console.log(e);
			throw e;
		}
	}
}
