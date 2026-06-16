import { Hono } from 'hono'
import {Events, Client, GatewayIntentBits, Collection, REST} from "discord.js";
import {join} from "node:path"
import {readdirSync} from "node:fs"

const app = new Hono()

export const token = process.env.DISCORD_TOKEN;
export const clientId = process.env.DISCORD_APPLICATION_ID;
export const guildId = process.env.DISCORD_GUILD_ID;

const client = new Client({intents: [GatewayIntentBits.Guilds]})

client.once(Events.ClientReady, (clientReady) => {
    console.log(`Ready logged-in as ${clientReady.user.tag}`)
})

client.login(token)

client.commands = new Collection();

const dirPath = join(__dirname, 'commands')
const commandDir = readdirSync(dirPath);

(async () => {
    for (const directory of commandDir) {
        const commandPath = join(dirPath, directory);
        const commandFile = readdirSync(commandPath).filter((file) => file.endsWith('.ts'));

        for (const file of commandFile) {
            const filePath = join(commandPath, file);
            const command = (await import(filePath)).default;

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing required data or execute property`);
            }
        }
    }
})();

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`[ERR] No command matching ${interaction.commandName} was found`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command !',
                flags: MessageFlags.Ephemeral
            })
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            })
        }
    }
})
export default app
