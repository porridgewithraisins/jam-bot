# jam-bot

A discord music bot (in progress)

## Todo

-   &#9745; Full suite of playback commands
-   &#9745; Add queue support
-   &#9745; REPL for every command
-   &#9745; Fix connection memory leak
-   &#9745; Multiple guilds at the same time
-   &#9744; Move audio player to web worker to avoid playback stutter while processing other commands
-   &#9744; Make client lockable. Extend discord.client and add mutex so that can't bombard
-   &#9744; Make all commands extend a single interface, to decouple app.ts from the actual commands.
-   &#9744; Support custom prefixes
-   &#9744; Playlist support (spotify too?)
-   &#9744; Duplicate Rythms !search feature