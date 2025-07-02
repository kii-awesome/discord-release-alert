const fs = require("node:fs/promises");
const wait = require("node:timers/promises").setTimeout;

const {
  SlashCommandBuilder,
  channelMention,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-repos")
    .setDescription("adding a project repository to the bot")
    .addStringOption((option) =>
      option
        .setName("protocol")
        .setDescription("Name of project")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("github-username")
        .setDescription("The project github username")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("github-repos")
        .setDescription("Name of repository")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("On which channel the notification will be sent")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const protocol = interaction.options.getString("protocol");
    const githubUsername = interaction.options.getString("github-username");
    const githubRepos = interaction.options.getString("github-repos");
    const channelId = interaction.options.getChannel("channel").id;

    await interaction.deferReply();
    await wait(4_000);

    try {
      const data = await fs.readFile("config.json", "utf8");
      const obj = JSON.parse(data);

      obj.push({
        project: protocol,
        user_github: githubUsername,
        user_repository: githubRepos,
        channel_id: channelId,
        last_version: "",
      });

      await fs.writeFile("config.json", JSON.stringify(obj, null, 2), "utf8");

      await interaction.editReply(
        `Add new project to channel ${channelMention(
          channelId
        )} with repository https://github.com/${githubUsername}/${githubRepos}`
      );
    } catch (err) {
      console.error("Error add project:", err);

      await interaction.editReply(`Error when adding a repository`);
    }
  },
};
