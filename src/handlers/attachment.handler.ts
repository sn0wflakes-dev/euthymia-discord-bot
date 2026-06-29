import { Client, Message } from "discord.js";
import { log } from "../config/logging";
import { filterAttachmentService } from "../services/attachment.service";


export function attachmentHandler(client: Client): void {
  log.info("Registering attachment handler");
  client.on("messageCreate", async (message: Message) => {
    if (message.attachments.size === 0) return;

    try {
      await filterAttachmentService(message); 
    } catch (error) {
      log.error(`Failed to process image, error : ${error}`);
    }
  });
}
