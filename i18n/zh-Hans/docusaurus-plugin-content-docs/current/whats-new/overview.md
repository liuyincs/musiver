---
title: "新版一览"
sidebar_position: 1
---

音流 Musiver 是对旧版 StreamMusic 的全面重写：共享 Rust 核心，各端原生界面（桌面 / Web 为 Tauri + React）。

## 值得一看

下面挑几处亮点，详情见对应功能页。

### 歌词搜索

曲目还没有歌词时，可在播放页搜索。有时间轴的歌词会随播放逐行高亮，支持逐词的会逐字高亮。

![完整播放页（同步歌词）](/img/docs/zh-Hans/features/desktop-full-player.jpg)

![歌词搜索](/img/docs/zh-Hans/features/desktop-lyrics-search.jpg)

见[歌词](../features/lyrics.md)。

### 均衡器与完整播放页

从播放条打开完整播放页。均衡器等听感工具在播放菜单中（会员）。

![完整播放页](/img/docs/zh-Hans/features/desktop-full-player.jpg)

![含均衡器的播放菜单](/img/docs/zh-Hans/features/desktop-equalizer-menu.jpg)

见[播放器](../features/player.md)。

### 歌单

在侧栏创建服务器歌单；支持的客户端还可使用智能歌单 JSON 规则。

![新建歌单](/img/docs/zh-Hans/features/desktop-playlist-editor.jpg)

见[歌单](../features/playlists.md)。

### DLNA 投屏（免费）

从播放条投到局域网设备。新版中 DLNA 免费。

![投屏设备](/img/docs/zh-Hans/features/desktop-dlna-cast.jpg)

见[播放器 → DLNA](../features/player.md#dlna-投屏)。

### 外观

主题色、主题风格等可在「设置 → 个性化」中调整。

![外观](/img/docs/zh-Hans/features/desktop-appearance.jpg)

见[外观](../features/appearance.md)。

### 发现与资料库

发现页有每日推荐与最近添加，并可进入艺术家、专辑详情。

![发现页](/img/docs/zh-Hans/features/desktop-discover.jpg)

见[浏览与发现](../features/library.md)。

## 一览表

| 领域 | 新变化 |
| --- | --- |
| 架构 | Rust 核心 + 原生 UI（不再是 Flutter） |
| 平台 | 新增 tvOS、Android TV、Linux、鸿蒙、自托管 Web |
| 服务器 | 新增 Audiobookshelf；Tag My Audio（实验） |
| 网络 | 多线路测速切换、局域网发现、HTTP 代理 |
| 听感 | 无损 / 转码档、均衡器、回放增益、更多格式 |
| 歌词 | 逐词、沉浸式（电视）、搜索、桌面 / 悬浮 / 状态栏 / 画中画 |
| 曲库工具 | 智能歌单 JSON、导入导出；跨服务器搬运仅限 Tag My Audio（实验） |
| 有声书 | Audiobookshelf 书架、继续收听、倍速记忆 |
| 会员 | 新权益目录（见[会员变化](../membership/changes.md)） |

## 继续阅读

- [新旧对比](old-vs-new.md) — 对照表
- [从旧版迁移](migrate.md) — 恢复购买并重新添加服务器
