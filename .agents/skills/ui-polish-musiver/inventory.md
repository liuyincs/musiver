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
