---
title: "Download and storage issues"
sidebar_position: 4
---

Open **Downloads** and inspect the task state before deleting anything.

| Problem | Next step |
| --- | --- |
| Task remains paused | Check Background Download Policy and whether your network meets it. |
| Task fails | Check server access and free storage, then retry the failed task. |
| A listed song will not play offline | Confirm its download completed; a library entry alone is not a local file. |
| Offline content disappeared after cleanup | Determine whether it came from cache or explicit downloads. |
| Cleanup did not reach zero | Files protected for current playback may have been retained. |

If a task fails repeatedly for one track, try playing that track online and compare another download. Include the selected quality and transcoding format in a report if the failure depends on them.

Avoid repeatedly clearing all storage as a first troubleshooting step: it can remove the audio you need offline. Read [cache and storage management](../features/offline.md) to choose the correct category.

Automatic downloads are affected by background execution and network policy. The Web app does not support formal downloads, so installing a supported client is required for that workflow.
