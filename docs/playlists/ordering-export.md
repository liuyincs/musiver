---
title: "Playlist ordering and server limitations"
sidebar_position: 2
---

The displayed order of a list and the order saved in a playlist are not always the same. Use the sort controls to browse; use playlist editing controls, when available, to change the saved order. Check the result after reopening the playlist.

## Export a playlist

1. Open an ordinary playlist.
2. Choose **More → Export** and select **M3U** or **TXT**.
3. Save the file using your device's export dialog.

Export includes the whole list, even if you have filtered the visible songs by name. Favorite songs and song-based daily recommendations also offer export on supported clients.

M3U uses the track paths supplied by the server. It is a list of references, not a download of the audio, and those paths may not be accessible to another player. TXT exports a title and artist per line, with multiple artists separated by `/`.

Smart playlists, import drafts, and album-based recommendations do not offer this export action. TV and CarPlay do not provide it either. Importing or transferring a list is currently a [Tag My Audio feature](../experimental/playlist-import-transfer.md), not universal synchronization between servers.
