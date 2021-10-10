<h1 align = "center"> JamBot Commands </h1>

-   The commands below are prefixed with `!`, however, you can [configure it](CONFIG.md#basic-configuration) to be anything you like.
-   None of them are case sensitive.

## Table of contents
-   [play](#play)
-   [lofi](#lofi)
-   [search](#search)
-   [pause](#pause)
-   [nowplaying](#nowplaying)
-   [skip](#skip)
-   [voteskip](#voteskip)
-   [restart](#restart)
-   [queue](#queue)
-   [move](#move)
-   [moverange](#moverange)
-   [remove](#remove)
-   [removerange](#removerange)
-   [keep](#keep)
-   [keeprange](#keeprange)
-   [clear](#clear)
-   [skipto](#skipto)
-   [playnow](#playnow)
-   [loop](#loop)
-   [loopq](#loopq)
-   [shutup](#shutup)
-   [speakagain](#speakagain)
-   [clean](#clean)
-   [quit](#quit)
-   [stash push](#stash-push)
-   [stash pop](#stash-pop)
-   [stash drop](#stash-drop)
-   [stash view](#stash-view)

## Commands

### play

Either `!play song1`\
or `!play song1 & song2` which would play `song1`, then `song2`\
or even [like this](#search)

Each `song` can either be:

1. keywords related to a song
2. a direct youtube (or youtube music) video/playlist URL
3. a direct spotify video/playlist/album URL

Note: soundcloud support has not been added yet

##### _Aliases_

`!p`

### lofi

`!lofi 1` to live stream [Lofi Girl - lofi hip hop radio - beats to relax/study to](https://www.youtube.com/watch?v=5qap5aO4i9A).

`!lofi 2` to live stream [Lofi Girl - lofi hip hop radio - beats to sleep/chill to](https://www.youtube.com/watch?v=DWcJFNfaw9c).

(live streams may take a couple of seconds to start playing, after which it should be normal)

You can also listen to these streams on the original artists' discord radio - https://discord.gg/lofigirl

### search

`!search query` will search YouTube and show you the result. You can then provide to the next `play` command, a position, a range of positions, or both, from the search result.\
For example, `!search pirates of the caribbean songs` followed by `!play 1 4 6-8` would add the songs at positions 1,4,6,7 and 8 in the search result, to the end of the currently playing queue.

### pause

`!pause` Pauses the playback of the current song

_Aliases_: `!stop`

### nowplaying

`!nowplaying`
Displays the currently playing song

_Aliases_: `!np`

### skip

`!skip` Skip the currently playing song

_Aliases_: `!s`

### voteskip

When [roles and permissions](CONFIG.md#roles-and-permissions) are configured such that
the `!skip` command is restricted, the members of the voice channel can vote to skip the current song with `!voteskip`

_Aliases_: `!vs`

### restart

`!restart` Restarts playback of the currently playing song.

_Aliases_: `!re`

### queue

`!queue` View all the songs in the queue currently, paginated.

_Aliases_: `!q`

### move

`!move i j` Move the song at position `i` in the queue to position `j`

_Aliases_: `!m`

### moverange

Moves a specified range of songs in the queue. For example, `!moverange 2-4 7` will move songs at positions 2,3,4 in the queue to position 7.

_Aliases_: `!mr`

### remove

Removes songs at specified position(s) in the queue. For example, `remove 1 8 9` removes the songs at positions 1, 8 and 9 from the queue.

_Aliases_: `!r`

### removerange

Removes specified range(s) from the queue. For example, `removerange 1-3 5-7` would remove the songs at positions 1,2,3,5,6 and 7 from the queue.

_Aliases_: `!rr`

### keep

Opposite of `remove`. `keep 1 4 6` would remove everything from the queue except the songs at positions 1, 4 and 6.

_Aliases_: `!k`

### keeprange

Opposite of `removerange`, `keeprange 1-3 5-6` would remove everything from the queue except the songs at positions 1,2,3,5 and 6.

_Aliases_: `!kr`

### clear

`!clear` Clears the current queue.

_Aliases_: `!clr`

### skipto

Skips to a position in the queue. For example, `!skipto 5` would skip to and immediately start playing the 5th item in the current queue.

### playnow

Syntax works exactly the same as `play` but the provided song is expedited to the top of the queue and played immediately. For example, `!playnow tum hi ho`

_Aliases_: `!pn`

### loop

`!loop` loops the currently playing song. `!loop` again stops looping it.

_Aliases_: `!l`

### loopq

`!loopq` loops all the songs in the current queue. `!loopq` again stops looping it.

_Aliases_: `!lq`

### shuffle

`!shuffle` shuffles the songs in the current queue in a random order.

### shutup

`!shutup` JamBot will stop sending text messages, if you want to avoid clutter.

_Aliases_: `!stfu`

### speakagain

`!speakagain` JamBot will resume sending text messages.

_Aliases_: `!talk` `!speak`

### clean

`!clean` will delete any message related to JamBot (both JamBot's messages, and the messages you used to command it) in the current text channel's last 100 messages.

### quit

`!quit` JamBot will quit the voice channel.

_Aliases_: `!dc`

## Stashing

Jam-bot can save your queues with a name of your choice so you can access it later!

### stash push

`!stash push range name` to stash any part of the currently playing queue, with the provided `name`. The `range` can either be `*` which represents the entire queue, or a range of positions like `4-15`.
For example, `stash push * mySongs` or `stash push 10-16 mySongs`. Note that names **cannot** have spaces

_Aliases_: `!stash add`

### stash pop

`!stash pop name` to retrieve a stashed queue by name and append its songs to the end of the currently playing queue.

### stash drop

`!stash drop name` to delete the stashed queue called `name`. Using `*` deletes all stashed queues.

### stash view

`!stash view name` to view the songs in the stashed queue with the given name. Using `*` shows all stashed queues.
