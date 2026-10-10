---
title: "New version overview"
sidebar_position: 1
---

Musiver is a ground-up rewrite of the previous StreamMusic app: a shared Rust core with native clients (desktop/Web use Tauri + React).

## Worth a look

Pick a highlight, then open the linked feature page for details.

### Word-by-word lyrics

Timed lyrics highlight as the song plays. Search from the player when a track has no lyrics yet.

![Lyrics search](/img/docs/whats-new/desktop-lyrics.jpg)

See [Lyrics](../features/lyrics.md).

### Equalizer and full player

Open the full player from the playback bar. Equalizer and related sound tools live under the player menu (membership).

![Full player](/img/docs/whats-new/desktop-full-player.jpg)

See [Player](../features/player.md).

### Smart playlists

Create server playlists in the sidebar, or use smart playlist JSON rules on supported clients.

![New playlist](/img/docs/whats-new/desktop-playlists.jpg)

See [Playlists](../features/playlists.md).

### DLNA casting (free)

Cast to a DLNA device from the playback bar. This is free in Musiver.

![Cast devices](/img/docs/whats-new/desktop-dlna.jpg)

See [Player → DLNA](../features/player.md#dlna-casting).

### Appearance

Accent color, theme style, and player preferences under Settings → Personalization.

![Appearance](/img/docs/whats-new/desktop-appearance.jpg)

See [Appearance](../features/appearance.md).

### Discover and library

Daily recommendations and recently added on the Discover home, with full artist and album pages.

![Discover](/img/docs/whats-new/desktop-discover.jpg)

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
