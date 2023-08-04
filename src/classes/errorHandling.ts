import dbSource from '../dbConnection';
import { DiscordError } from '../entity';
import { IVariablesList } from '../interfaces/variables';

class ErrorLogger {

	constructor (error: unknown, command: string, variables?: IVariablesList){
		const entity = new DiscordError;

		entity.command = command;
		entity.error = JSON.stringify(error) as string;
		if (variables) {entity.variables = JSON.stringify(variables)};

		dbSource.getRepository(DiscordError).save(entity);
		
	}

}

export default ErrorLogger;