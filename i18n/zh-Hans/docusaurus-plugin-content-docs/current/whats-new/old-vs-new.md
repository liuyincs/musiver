---
title: "新旧对比"
sidebar_position: 2
---

对比**旧版音流 StreamMusic**与**新版音流 Musiver**。来源：旧版 `docs/features.md` / 指南；新版 README 与已确认会员权益目录。

![架构对比](/img/docs/illustrations/architecture-old-vs-new.svg)

| 项目 | 旧版 StreamMusic | 新版 Musiver |
| --- | --- | --- |
| 技术 | Flutter | Rust 核心 + 各端原生（桌面/Web：Tauri + React） |
| 平台 | Android、iOS、macOS、Windows | + tvOS、Android TV、Linux、鸿蒙、Web |
| 服务器 | Subsonic/Navidrome、Emby、Jellyfin、Audio Station、Plex | + Audiobookshelf；Tag My Audio（实验） |
| 登录 | 密码 / OTP（Plex、Audio Station） | 密码、API 密钥、双因素、Plex OAuth、Plex Home 切换 |
| 网络 | 备用线路（会员） | 多线路自动切换、局域网发现、HTTP 代理 |
| 同步/媒体库模式 | 媒体库模式 + 直连模式 | **尚未实现**（旧版「同步模式」即媒体库模式） |
| 歌词 | 显示编辑 + 桌面/状态栏/画中画 | 逐词、沉浸式、通知栏/悬浮、内置搜索 |
| 音质 | 回放增益 | 无损/转码、均衡器、回放增益、格式筛选 |
| 有声书 | 长音频偏好（会员） | AudiobookShelf 书架、继续收听、倍速记忆、资料库类型 |
| 歌单 | 服务器歌单 | 智能歌单 JSON；导入导出/跨服务器搬运 |
| 设备迁移 | 扫码同步数据 | 未确认可导入旧版配置 |
| 会员 | 买断、7 设备 | 终身、7 设备、含后续更新；公测可试用会员功能 |
| 免费范围 | 含自动下载、边听边存、扫码同步等 | 浏览资料库、在线播放全部、一台服务器 |
| 下载 | 手动下载会员；自动下载免费 | 手动与自动下载均为会员 |
| DLNA | 会员（曾注明兼容性差） | **免费** |
| 购买 | iOS App Store、安卓支付宝 | + Google Play、华为 IAP、**桌面支付宝**；邮箱/订单恢复 |

:::note 媒体库模式
旧版的**同步模式 / 媒体库模式**（完整同步歌曲/专辑/艺术家到本地，用于文件夹视图与重复检测）在新版中**尚未实现**。对比工作流时请如实说明。
:::
