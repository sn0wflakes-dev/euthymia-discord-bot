import { Message } from "discord.js";
import { debugEmbed } from "../utils/embeds.builder";
import { classifyImage } from "../grpc/services/nsfw-filter.grpc";
import { log } from "../config/logging";


export async function filterAttachmentService(message: Message): Promise<void> {

  const attachments = [...message.attachments.values()];

  for (const attachment of attachments) {
    if (!attachment.contentType?.startsWith("image/")) continue;

    const res = await fetch(attachment.proxyURL);
    const buffer = Buffer.from(await res.arrayBuffer());

    const result = await classifyImage({
      image_data: buffer,
      filename: attachment.name
    });

    log.debug(`NSFW classify result: ${result.label} (${result.confidence})`);

    if (result.label == "sfw") {
      return;

    } else if (result.label == "nsfw" || result.label == "sketchy") {
      await message.reply({
        embeds: [debugEmbed("NSFW Filter Worker", `This image is labeled as ${result.label} and will be deleted soon`)]
      });

      message.delete();
    }
  }
}
