import { ChatInputCommandInteraction, Client, Collection, SharedSlashCommand} from "discord.js";
import * as agent from "../commands/reference/agent";
import { log } from "../config/logging";

interface Command {
  data: SharedSlashCommand;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const commands = new Collection<string, Command>();
commands.set(agent.data.name, agent);

export function registerCommandHandler(client: Client): void {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply({
        content: `Command ${interaction.commandName} not found`,
        ephemeral: true
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      log.error(`Error while executing commands ${interaction.commandName}:`, error);

      const reply = interaction.replied || interaction.deferred 
        ? interaction.followUp.bind(interaction) 
        : interaction.reply.bind(interaction);

      await reply({content: "Error while executing command", ephemeral: true});

    }
  });
}

export function getCommandsData(): SharedSlashCommand[] {
    return commands.map((cmd) => cmd.data);
}

