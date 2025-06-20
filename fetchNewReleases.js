const { readFile, writeFile } = require('node:fs/promises');

async function fetchNewReleases(client) {
  try {
    const data = await readFile("config.json", "utf8");
    const protocols = JSON.parse(data);

    let updated = false;

    // loop all
    for (const protocol of protocols) {
      const {
        user_github,
        user_repository,
        channel_id,
        last_version,
      } = protocol;

      try {
        const response = await fetch(
          `https://api.github.com/repos/${user_github}/${user_repository}/releases/latest`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch release for ${user_repository}`);

        const release = await response.json();
        const versionTag = release.tag_name;
        const releaseUrl = release.html_url;

        if (versionTag && versionTag !== last_version) {
          const channel = await client.channels.fetch(channel_id);
          // let customRoles = '';
          if (channel) {
            await channel.send(
              `📢 **New Release Available! Version: ${versionTag}**\n` +
              `🔗 Check out! ${releaseUrl}`
            );
          }

          protocol.last_version = versionTag;
          updated = true;
        }
      } catch (err) {
        console.error(`❌ Error checking ${user_repository}:`, err.message);
      }
    }

    if (updated) {
      await writeFile("config.json", JSON.stringify(protocols, null, 2), "utf8");
      console.log("✅ config.json updated with latest versions.");
    }
  } catch (err) {
    console.error("❌ Error processing config.json:", err.message);
  }
}

module.exports = { fetchNewReleases };
