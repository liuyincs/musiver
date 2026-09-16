---
title: "Cache and storage management"
sidebar_position: 3
---

Musiver distinguishes playback cache from explicit downloads. On supported installed clients, use **Listen and Save** in storage settings to cache audio while listening, and set a cache limit if needed.

## Free space

1. Open **Settings → Storage Management**.
2. Review the categories before choosing what to clear.
3. Read the confirmation, then clear the intended category.

| Action | Effect |
| --- | --- |
| Clear all caches | Clears audio and image caches. Offline songs available only through cache can disappear. Explicit downloads are separate. |
| Clear downloads | Removes explicit downloads across servers and cancels queued or active download tasks. |
| Database and configuration | Shows storage use; it is not a general cleanup button. |

Playback protection can keep files currently in use, so a cleanup result need not be zero bytes. On Android, cache cleanup can also retain adjacent tracks needed for playback, and clearing downloads does not interrupt the current downloaded track.

Clearing local storage does not delete the server's source audio. Before a trip, recheck [offline availability](listening.md) after any cleanup. The Web storage page only shows categories it can reliably manage; it has no native Listen and Save settings.
