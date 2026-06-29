import { EmbedBuilder } from "discord.js";

export function successEmbed(title: string, description: string) {
  return new EmbedBuilder().setColor(0x22c55e).setTitle(title).setDescription(description).setTimestamp();
}

export function errorEmbed(title: string, description: string) {
  return new EmbedBuilder().setColor(0x3b82f6).setTitle(title).setDescription(description).setTimestamp();
}

export function debugEmbed(title: string, description: string) {
  return new EmbedBuilder().setColor(0x7678ed).setTitle(title).setDescription(description).setTimestamp();
}
