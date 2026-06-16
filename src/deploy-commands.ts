import {join} from "node:path";
import {readdirSync} from "node:fs";
import {REST, Routes} from "discord.js";
import {clientId, guildId, token} from "./app";

const commands = [];
const dirPath = join(__dirname, 'commands');
const commandDirectory = readdirSync(dirPath);
for (const folder of commandDirectory) {
    const commandsPath = join(dirPath, folder);
    const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = (await import(filePath)).default;
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST().setToken(token);
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();