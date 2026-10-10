---
title: "New version overview"
sidebar_position: 1
---

Musiver is a ground-up rewrite of the previous StreamMusic app: a shared Rust core with native clients (desktop/Web use Tauri + React).

## Worth a look

Pick a highlight, then open the linked feature page for details.

### Lyric search

Search for lyrics from the player when a track has none yet. When a track already has timed lyrics, the full player can highlight them as the song plays.

![Full player with synced lyrics](/img/docs/features/desktop-full-player.jpg)

![Lyric search](/img/docs/features/desktop-lyrics-search.jpg)

See [Lyrics](../features/lyrics.md).

### Equalizer and full player

Open the full player from the playback bar. Equalizer and related sound tools live under the player menu (membership).

![Full player](/img/docs/features/desktop-full-player.jpg)

![Player menu with Equalizer](/img/docs/features/desktop-equalizer-menu.jpg)

See [Player](../features/player.md).

### Playlists

Create server playlists from the sidebar. Supported clients can also use smart playlist JSON rules.

![New playlist](/img/docs/features/desktop-playlist-editor.jpg)

See [Playlists](../features/playlists.md).

### DLNA casting (free)

Cast to a DLNA device from the playback bar. This is free in Musiver.

![Cast devices](/img/docs/features/desktop-dlna-cast.jpg)

See [Player → DLNA](../features/player.md#dlna-casting).

### Appearance

Accent color, theme style, and player preferences under Settings → Personalization.

![Appearance](/img/docs/features/desktop-appearance.jpg)

See [Appearance](../features/appearance.md).

### Discover and library

Daily recommendations and recently added on the Discover home, with full artist and album pages.

![Discover](/img/docs/features/desktop-discover.jpg)

See [Browse and discover](../features/library.md).

## Summary table

| Area | What is new |
| --- | --- |
| Architecture | Rust core + native UI (not Flutter) |
| Platforms | Adds tvOS, Android TV, Linux, HarmonyOS, self-hosted Web |
| Servers | Adds Audiobookshelf; Tag My Audio (experimental) |
| Network | Multi-route speed testing, LAN discovery, HTTP proxy |
| Sound | Lossless / transcode tiers, equalizer, ReplayGain, more formats |
| Lyrics | Word-by-word, immersive (TV), search, desktop / floating / status / PiP |
| Library tools | Smart playlist JSON, import/export / cross-server transfer |
| Spoken audio | Audiobookshelf shelf, resume, playback-speed memory |
| Membership | New benefit catalog (see [membership changes](../membership/changes.md)) |

## Also read

- [New vs old](old-vs-new.md) — detailed comparison table
- [Migrating from the old version](migrate.md) — restore purchases and re-add servers
