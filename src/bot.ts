import { Client, GatewayIntentBits } from "discord.js";
import { log } from "./config/logging"
import { registerCommandHandler } from "./handlers/command.handler";
import { env } from "./config/env";
import { clearCommands, registerCommands } from "./script/register-commands";
import { attachmentHandler } from "./handlers/attachment.handler";

export function createBot(): Client {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

  client.once("clientReady", (c) => {
    log.info(`Bot ready : logged in as ${c.user.displayName}`);
  });

  attachmentHandler(client);
  registerCommandHandler(client);

  return client;
}


export async function startBot(client: Client): Promise<void> {
  await clearCommands();
  await registerCommands();
  await client.login(env.DISCORD_TOKEN);
}
