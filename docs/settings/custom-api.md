---
title: "Custom API"
sidebar_position: 2
---

Custom API settings let a supported installed client request artwork or lyrics from an additional service. The Web app does not expose these settings. You need endpoint details from the service you intend to use.

1. Open **Settings → Custom API**.
2. Fill in the cover URL, lyric URL, or lyric-confirmation URL required by that service. Add an Authorization header only if the service requires one.
3. Choose whether to **Prefer Server API**, and configure the available album/artist artwork options.
4. Open **Test API** before relying on the service.

## Test a configuration

Enter a song title, album, and artist, or use the currently playing song. Run the test and inspect the status code, response, and available artwork or lyric preview. A response arriving successfully does not necessarily mean it contains a usable match.

If a test fails, check the URL and credentials against the provider's configuration. Do not share Authorization values in a screenshot or public issue. Once the source works, it can be selected in [lyric search](../features/lyrics.md).
