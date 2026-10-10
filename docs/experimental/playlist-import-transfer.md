---
title: "Playlist import and cross-server transfer"
sidebar_position: 2
---

These operations create a playlist in **Tag My Audio**. They do not copy audio files or continuously synchronize servers. Use Tag My Audio 0.1.30 or later and a supported client while online; see [preview availability](tag-my-audio.md).

## Import a file or pasted text

1. Activate Tag My Audio and open the import action beside your playlists. On Apple clients, choose **From File**.
2. Choose an M3U or TXT file, or select the matching M3U/TXT format before pasting playlist text.
3. Select a real destination library. **All Libraries** is not a destination.
4. Enter a name if desired. A duplicate name reports an error rather than overwriting an existing playlist.
5. For TXT, choose the delimiter and map the title column. Artist and album columns are optional; enable **Skip first line** if the first row contains headings.
6. Import and inspect the **Playlist Worksheet**.

The worksheet is a draft, not yet a playable playlist. Open a track's candidates to inspect or change its match. Search by title, artist, or album where needed, and check only the tracks you want to include. Select **Commit** to create the final private playlist. Reopening an unfinished draft returns to its worksheet.

## Transfer from another server

iOS and macOS clients provide **Import → From Other Servers**. Add the source server beforehand, then activate the destination Tag My Audio server.

Choose the source server, its library when prompted, and one playlist or favorite-song list. Select a real destination library if asked. A successful transfer opens a draft for review and commitment using the same worksheet.

This copies one list at a time. Favorite songs become a playlist, not Tag My Audio favorites; descriptions and covers are not transferred. Matching can omit tracks without usable paths or choose a same-named file, so review the matches before committing. The destination must already have the relevant audio.
