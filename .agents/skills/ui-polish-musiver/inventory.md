# 来源与覆盖核对

- 平台：单一 Docusaurus Web 客户端 src/pages；桌面、手机、平板形态按各页面 CSS 的 768、900、996 断点拆分，无原生客户端。主题与语言取 docusaurus.config.ts。
- 页面源为文件路由，无已有 JSON 页面注册表：src/pages/index.tsx → home，download.tsx → download，pricing.tsx → pricing，changelog.tsx → changelog。对应 CSS、共享样式、i18n 和发布数据都列入 sources。
- 顶部导航在 docusaurus.config.ts：/、/pricing、/download、/changelog 均已覆盖；Docs 入口及首页快速开始、价格页会员文档只检查链接在营销页的展示，目标 /docs/** 排除。外部 GitHub 链接不作为内部界面。
- 弹出界面来自 Docusaurus 主题：语言 dropdown → navigation-desktop / navigation locale；窄屏侧栏 → navigation menu；侧栏语言子菜单 → navigation menu-locale。正文四页无 dialog、sheet、popover、首启流程、设置子页。
- download 分支：stable/beta 及六个平台共 12 组合；列表存在、空列表、URL 空／非空、测试版版本标签、稳定版元信息均使用真实数据，源码 src/pages/download.tsx 与 src/data/releases/*.json。当前无法真实触发的分支必须记录 gaps，不用假页面替代。
- pricing：比较表布尔勾选、可选注释、四项常显 FAQ 已由 default 整页涵盖，无 accordion。
- changelog：commonChanges 缺省、空平台 changes、可选下载链接由现有三条历史版本覆盖。
- 无已有截图/E2E 命令；新增 scripts/capture-ui.mjs 与 pnpm ui:capture。统一入口 package.json，拼图工具 ffmpeg。
- 设计规范与约定：根 AGENTS.md 的 pnpm 与国际化要求；现有页面和 CSS 作为布局依据。未找到其他平台 AGENTS.md 或已确认设计决定文件。无设备分工配置。
- 项目技能目录沿用 .agents/skills（已有 sumv）。评分前由用户指定 Opus；打磨范围须在评审草案生成后由用户确认。

## 首次跑通记录（2026-11-17）

- 6 个界面定义、36 个状态定义、200 个平台×主题×状态格；无登记 gaps，无平台族布局待定项。
- desktop/phone/tablet 均完成真实首页截图；共享导航三形态完整校验，下载 desktop 的 48 格校验通过，稳定版禁用按钮与测试版链接断言通过。
- 用户指定 Opus，经 Devin/Opus 5.5 完成五轮独立评审，无换路。桌面首页最低分依次 7.2、8.3、8.5、8.3、9.0；最终四格 9.2、9.1、9.1、9.0 达到阈值。
- 用户确认 desktop/home 范围已写入蓝图；五轮建议处理记录与截图报告输出到仓库外 /tmp/ui-polish-musiver/home/report.html。
- 最终同构建连拍四格完全一致，ignore 为空。构建与 typecheck 通过，地图检查接入 pnpm typecheck。
- 评分只覆盖桌面首页四格，其他 196 格尚未评分；手机和平板是 Chromium 响应式基准，不代表真机 Safari 或其他浏览器验证。
- 后续可选决定：编号 lining 数字特性、深色 CTA 边框颜色、中文首屏说明自身的断行；不属于当前已确认范围，未擅自修改。
