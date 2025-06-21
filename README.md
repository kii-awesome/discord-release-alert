# Releases Alert for Discord Genznodes

- Using discord.js https://discord.js.org/
- Temp config
- Fetch every hours

### Reload or Refresh Slash command

```bash
node deploy-commands.js
```

### example config.json

```json
[
    {
        "protocol": "",
        "user_github": "",
        "user_repository": "",
        "channel_id": "",
        "last_version": ""
    }
]
```

### Run

```bash
git clone https://github.com/kii-awesome/discord-release-alert
cd discord-release-alert
cp .env.sample .env
cp config.example.json config.json
node .
```