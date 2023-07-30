import dbSource from '../dbConnection';
import { DiscordError } from '../entity';
import { IVariablesList } from '../interfaces/varables';

class ErrorLogger {

	constructor (error: string, command: string, variables?: IVariablesList){
		const entity = new DiscordError;

		entity.command = command;
		entity.error = error;
		if (variables) {entity.variables = JSON.stringify(variables)};

		dbSource.getRepository(DiscordError).save(entity);
		
	}

}

export default ErrorLogger;