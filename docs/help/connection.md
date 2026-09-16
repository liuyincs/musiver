---
title: "Connection problems"
sidebar_position: 2
---

Start by identifying whether sign-in fails, the server cannot be reached, or the library is empty after sign-in.

| Symptom | Check first |
| --- | --- |
| Cannot reach the server | Address, protocol, port, base path, current network, and whether the server is running. |
| Authentication rejected | Server type, username/password, account status, and any requested verification. |
| Works at home only | The remote route and whether it is reachable outside your home network. |
| Signed in but no content | Current library, account permissions, and the server's audio-library scan. |
| Works in the installed app but not Web | Browser network restrictions and the [Web limitations](../devices/web.md). |

Open the server in its own interface from the same device and network. This helps separate a server or network problem from a Musiver-specific one.

In **Connection Routes**, inspect **Current connection** rather than assuming the first address is in use. Temporarily disabling a newly configured [proxy](../settings/network-proxy.md) can help isolate proxy-related failures.

If the problem remains, [report it](feedback.md) with the server type, app version, network situation, and exact error. Mask passwords, tokens, and private connection details in public reports.
