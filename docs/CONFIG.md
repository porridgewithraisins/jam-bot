# Configuring the bot

### Basic configuration

#### Fields:

**token**: Your discord bot token\
**prefix**: A command prefix of your choice (multiple characters are fine)

```js
{
    token: "your_discord_bot_token",
    prefix: "!"
}
```

### Spotify support

You will need to create a [spotify application](https://developer.spotify.com/dashboard/) and provide your client ID and client secret, so that JamBot can interact with the Spotify Web API.

```js
{
    spotify: {
        clientId: "your_spotify_client_id",
        clientSecret: "your_spotify_client_secret"
    }
}
```

As required, JamBot will automatically generate access tokens for the API using your client ID and client secret. You will not need to do that.


**_Disclaimer_** :

1. Only information about songs is retrieved through the official spotify web API. There is no illegal downloading from spotify going on here.

### Roles and Permissions

So as to keep configuration minimal, JamBot has its roles and permissions system disabled out of the box. You can enable it, and fully customize it, by providing the following fields in the configuration.

**permissions**: `{rolename : [commands]}` Specify for each role, the commands that will be _exclusive_ to that role. You can also configure commands to be exclusive to multiple roles. Note that the role name is case sensitive.

**allowUnattended**: (_default: true_) Whether or not to respect the defined permissions for a command when it is used in a voice channel where none of the its members are allowed to use said command.

Command names are recognized as present [here](COMMANDS.md#table-of-contents).

Notes:

-   `lofi` command inherits permissions from `play`, you need not specify it explicitly.

```js
{
    permissions: {
        DJ: [
            "pause",
            "skip",
            "quit",
            "move",
            "moverange",
            "remove",
            "removerange",
            "keep",
            "keeprange",
            "skipto",
            "stash drop"
        ],
        ["Some other role"]: ["stash push", "quit"]
    },
    allowUnattended: false
}
```

### Extra configuration

**periodicallyLogPerformance** : (_default: false_) Log the resource usage of the bot periodically.

## Full example configuration

```js
bot.init({
    token: "abcdefgh123456789",
    prefix: ";;",
    spotify: {
        clientId: "abcdefghijklmnopqrstuvqxyz",
        clientSecret: "zyxqvutsrqponmlkjihgfedcba"
    },
    permissions: {
        DJ: [
            "pause",
            "skip",
            "quit",
            "move",
            "moverange",
            "remove",
            "removerange",
            "keep",
            "keeprange",
            "skipto",
            "stash drop"
        ],
        Stasher : ["stash", "quit"]
    },
    allowUnattended: false,
    periodicallyLogPerformance : true
});
```
