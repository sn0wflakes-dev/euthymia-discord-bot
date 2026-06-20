import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AgentTypes } from "../../types/api.agents.types";
import { addAgentService } from "../../services/agent.service";
import { errorEmbed, successEmbed } from "../../utils/embeds.builder";
import { log } from "../../config/logging";

export const data = new SlashCommandBuilder()
  .setName("add_agent")
  .setDescription("Adding agent to API")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Agent name")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("Agent type")
      .setRequired(true)
      .addChoices(
        { name: "Duelist", value: "duelist" },
        { name: "Controller", value: "controller" },
        { name: "Initiator", value: "initiator" },
        { name: "Sentinel", value: "sentinel" },
      )
  )
  .addBooleanOption((option) =>
    option
      .setName("have_molly")
      .setDescription("Does this agent have a molly ability?")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("have_flash")
      .setDescription("Does this agent have a flash ability?")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("agent_creation_date")
      .setDescription("Agent release date (YYYY-MM-DD)")
      .setRequired(true)
  );

export async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  await interaction.deferReply();

  const name = interaction.options.getString("name", true);
  const type = interaction.options.getString("type", true).toUpperCase() as AgentTypes;
  const haveMolly = interaction.options.getBoolean("have_molly", true);
  const haveFlash = interaction.options.getBoolean("have_flash", true);
  const createdAt = interaction.options.getString("agent_creation_date", true);

  try {
    const result = await addAgentService(({
      name,
      type,
      haveMolly,
      haveFlash,
      createdAt
    }));

    await interaction.editReply({
      embeds: [successEmbed("Add Agent", `Agent ${result.name} with id ${result.id} successfully added into system`)]
    });
  } catch (error) {
    log.error(`Failed to add agent, error : `, error);
    const messageError = error instanceof Error ? error.message : "Unknown error";
    await interaction.editReply({
      embeds: [errorEmbed("Add Agent", `Failed add agent, please try again later. Error : ${messageError}`)]
    });
  }

}
