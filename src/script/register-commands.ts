import { REST, Routes } from "discord.js";
import { env } from "../config/env";
import { getCommandsData } from "../handlers/command.handler"
import { log } from "../config/logging"

export async function clearCommands(): Promise<void> {
  const rest = new REST().setToken(env.DISCORD_TOKEN);

  await rest.put(Routes.applicationCommands(env.DISCORD_APPLICATION_ID), { body: [] });
  await rest.put(
    Routes.applicationGuildCommands(env.DISCORD_APPLICATION_ID, env.DISCORD_GUILD_ID),
    { body: [] }
  );

  log.info("Global commands cleared");
}

export async function registerCommands(): Promise<void> {
  const rest = new REST().setToken(env.DISCORD_TOKEN);

   try {
    const commands = getCommandsData().map((cmd) => cmd.toJSON());

    log.info(`Registering ${commands.length} slash commands`);

    await rest.put(Routes.applicationGuildCommands(env.DISCORD_APPLICATION_ID, env.DISCORD_GUILD_ID), {
      body: commands
    });

    log.info(`Logs registered successfully`);
  } catch (error) {
    log.error(`Failed to registering commands`);
    process.exit(1);
  }
}
