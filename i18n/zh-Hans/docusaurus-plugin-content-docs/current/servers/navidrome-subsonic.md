---
title: "Navidrome 与 Subsonic"
sidebar_position: 2
---

此方式适用于 Navidrome，或提供 Subsonic API 的服务器。在“添加服务器”中选择对应类型。

1. 填写服务器地址，确认 HTTP 或 HTTPS 协议、端口及必要的路径。
2. 填写管理员提供的用户名和密码。
3. 登录并检查可用的资料库。
4. 进入资料库，播放一首歌曲，确认浏览和音频传输都能正常工作。

请使用服务器基础地址，不要填写单首歌曲或管理页面的链接。如果服务部署在 `/music` 等子路径下，配置线路时需要保留该路径。

兼容程度取决于服务器实现的 API。不同 Subsonic 兼容服务的共享歌单、电台、文件夹等能力可能不同，缺少某个操作入口不一定表示连接失败。

如果在家可用、外出不可用，请配置[内外网线路](connections.md)。

## 服务端准备

安装和管理服务器请参考官方说明：[Navidrome 安装说明](https://www.navidrome.org/docs/installation/)和 [Subsonic 安装说明](https://www.subsonic.org/pages/installation.jsp)。请按实际服务端版本选择相应教程。

