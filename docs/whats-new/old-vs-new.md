---
title: "New vs old"
sidebar_position: 2
---

Comparison of StreamMusic (old) and Musiver (new).

![Architecture comparison](/img/docs/illustrations/architecture-old-vs-new.svg)

| Topic | StreamMusic (old) | Musiver (new) |
| --- | --- | --- |
| Tech | Flutter | Rust core + native clients (desktop/Web: Tauri + React) |
| Platforms | Android, iOS, macOS, Windows | + tvOS, Android TV, Linux, HarmonyOS, Web |
| Servers | Subsonic/Navidrome, Emby, Jellyfin, Audio Station, Plex | + Audiobookshelf; Tag My Audio (experimental) |
| Sign-in | Password / OTP (Plex, Audio Station) | Password, API key, 2FA, Plex OAuth, Plex Home switch |
| Network | Backup routes (member) | Multi-route auto switching (free), LAN discovery, HTTP proxy |
| Sync / library mode | Library mode + direct mode | Direct mode only (online reads from the server); library mode not implemented yet |
| Lyrics | Display/edit + desktop/status/PiP overlays | Word-by-word, immersive, notification/floating, built-in search |
| Sound | ReplayGain | Lossless/transcode tiers, equalizer, ReplayGain, format filters |
| Spoken audio | Long-audio preference (member) | Audiobookshelf shelf, resume, speed memory, library types |
| Playlists | Basic server playlists | Smart playlist JSON; import/export; cross-server move only via Tag My Audio (experimental) |
| Device migration | QR data sync | Cannot import old app config |
| Membership | Lifetime buyout, 7 devices | Lifetime, 7 devices, includes future updates; beta can trial member features |
| Free scope | Included auto-download, listen-and-save, QR sync, etc. | Browse library, stream all songs, one server |
| Downloads | Manual download member; auto-download free | Manual and auto-download are membership |
| DLNA | Membership (poor compatibility noted) | Free |
| Purchase | iOS App Store, Android Alipay | + Google Play, Huawei IAP, desktop Alipay; email / order restore |

:::note Library mode
The old app’s sync mode / library mode (full local mirror of songs/albums/artists for folder view and duplicate detection) is not yet implemented. Musiver currently uses direct mode: it reads the library online from your server.
:::
