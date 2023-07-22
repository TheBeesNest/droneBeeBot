import { Client, GatewayIntentBits, Events } from 'discord.js';
import 'dotenv/config';


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

console.log('starting up Bot!')

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.botApiToken);