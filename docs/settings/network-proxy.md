---
title: "Network proxy"
sidebar_position: 3
---

Use the client's network-proxy setting only when your connection requires a proxy. It is separate from the server's [connection routes](../servers/connections.md). The Web app does not expose this client setting.

1. Open **Settings → Network Proxy** on a supported installed client.
2. Enable the proxy and enter the address in a supported form: `host:port`, `http://host:port`, or `https://host:port`.
3. With a server active and a usable connection configured, select **Test Connection**.
4. Return to the library and test a song as well as browsing.

If testing is unavailable, first select a server and check its connection. Local loopback targets bypass the proxy; enabling it does not send every possible local request through that service.

If connectivity fails after enabling the proxy, disable it and test again to isolate the cause. A proxy address is not a replacement for a correct music-server address, and configuring one does not make an unavailable server work automatically.
