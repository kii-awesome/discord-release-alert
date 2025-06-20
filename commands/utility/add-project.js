const fs = require("node:fs");
const { SlashCommandBuilder, channelMention, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-repos")
    .setDescription("adding a project repository to the bot")
    .addStringOption((option) =>
      option
        .setName("protocol")
        .setDescription("name of project")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("protocol-github")
        .setDescription("The project github username")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("protocol-repos")
        .setDescription("name of repository")
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
    const githubUsername = interaction.options.getString("protocol-github");
    const githubRepos = interaction.options.getString("protocol-repos");
    const channelId = interaction.options.getChannel("channel").id;

    fs.readFile("config.json", "utf8", function readFileCallback(err, data) {
      if (err) {
        console.log("Error when adding project", err);
      } else {
        let obj = JSON.parse(data);
        obj.push({
          project: protocol,
          user_github: githubUsername,
          user_repository: githubRepos,
          channel_id: channelId,
          last_version: "",
        });
        let json = JSON.stringify(obj, null, 2);
        fs.writeFile("config.json", json, "utf8", (err) => {
          if (err) {
            console.error("Failed to save");
          } else {
            console.log("Success add a project to config file");
          }
        });
      }
    });
    await interaction.reply(
      `Add new project to channel ${channelMention(
        channelId
      )} with repository https://github.com/${githubUsername}/${githubRepos}`
    );
  },
};
