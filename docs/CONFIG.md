# Configuring the bot

First [create a discord bot user](docs/TOKEN.md), and [add it to your server](docs/ADDING.md).

Once you've [installed](../README.md#installing) the bot, create a file `config.json` in the `musicbot` folder you created for the bot. Fill it in like so

### Basic configuration (required)

#### Fields:

_token_: Your discord bot token\
_prefix_: A command prefix of your choice (even multiple characters are fine)

```json
{
    "token": "your_discord_bot_token",
    "prefix": "!"
}
```

### Spotify support

To enable the bot to play songs from spotify URLs, you will need to create a [spotify application](https://developer.spotify.com/dashboard/) so as to retrieve song metadata from the Spotify Web API.

Add your Client ID and Client Secret as fields in the `config.json`

```json
{
    "spotify": {
        "clientId": "your_spotify_client_id",
        "clientSecret": "your_spotify_client_secret"
    }
}
```

As required, JamBot will automatically regenerate access tokens for the API.

**_Disclaimer_** : The song metadata is retrieved and then piped to a youtube downloader. There is no illegal downloading from spotify going on here.

### Roles and Permissions

So as to keep configuration minimal, JamBot has its roles and permissions system disabled out of the box. You can enable it by providing the following fields in the configuration.

**rolesAndPerms** : (default : `false`) Set it to `true` to enable the roles and permissions module.

**discordRoles**: The list of case-sensitive discord role names you would like JamBot to recognize.

**customRoles** : If you don't want to pollute your discord server's roles, you can also define them here (case-sensitive). Then, for each custom role defined, you can provide discord user IDs<sup> [1](https://www.google.com/search?q=how+to+get+discord+user+id)</sup> who will belong to that role.

**permissions** : For each role you defined (either in **discordRoles** or in **customRoles**), specify the list of commands that will be restricted to users belonging to that role. Unspecified commands will be available to everyone. You can view all available commands by using the `help` command in a text channel, or [here](COMMANDS.MD).

**allowUnattended** : `true` or `false`. Whether or not the above permissions will be enforced in a voice channel with neither a **discordRole** or a **customRole** present at the time. Note: `stash drop` and `stash push` will always be restricted to the roles defined in **discordRoles** or **customRoles** (provided this module is enabled) due to its persistent nature.

**Example**:

```json
{
    "discordRoles": ["DJ"],
    "customRoles": {
        "abc": ["8374829328492831", "7892125436794542"],
        "def": ["7992839825894542"]
    },
    "permissions": {
        "DJ": ["skip", "quit", "move", "skipto", "stash push"],
        "abc": ["stash push", "quit"],
        "def": ["keep", "skipto"]
    }
}
```

If the same command is listed for multiple roles, each of those roles will be able to use the command.

### Local music files

JamBot can also play audio files stored locally in your computer!

**localFolder**: a list of _absolute_ paths to folders JamBot will look in for songs.

**Example**:

```json
{
    "localFolder": ["/home/me/Music", "/home/me/Concert"]
}
```

### Advanced configuration

Along with the basic configuration, you can also add the following fields.

**logLevel**: (_default_: 0) Set it to `1`, `2`, or `3`. The higher the log level the more verbose the logging of the bot will be.

_Level 0_: Only (fatal and non-fatal) errors.

_Level 1_: Log persistent changes, such as `stash` commands, and access to local files.

_Level 2_: Log any messages processed, along with the messages/actions done by the bot.

_Level 3_: Log execution of every intermediate service and function.

**logPerformance**: (_default_: false) Whether or not to periodically log the resource usage of the bot.

```json
{
    "logLevel": 2,
    "logPerformance": true
}
```
