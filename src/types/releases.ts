/**
 * =============================================================================
 * Releases Schema - 版本发布数据类型定义
 * =============================================================================
 *
 * 本文件定义了 Musiver 应用版本发布数据的 TypeScript 类型 schema。
 * 用于描述 src/data/releases/ 目录下 JSON 文件的数据结构。
 *
 * 数据结构说明:
 * - stable.json: 稳定版发布数据，所有平台共享同一个版本号
 * - beta.json: 测试版发布数据，每个平台可包含多个历史版本
 *
 * @module types/releases
 * @see src/data/releases/stable.json
 * @see src/data/releases/beta.json
 * @see src/pages/download.tsx
 */

/**
 * 支持的平台类型
 *
 * 定义了 Musiver 应用支持的所有目标平台：
 * - android: Android 移动设备
 * - ios: iOS 移动设备（iPhone/iPad）
 * - harmony: HarmonyOS 鸿蒙系统
 * - macos: macOS 桌面系统
 * - windows: Windows 桌面系统
 * - web: Web 浏览器版本
 */
export type Platform = 'android' | 'ios' | 'harmony' | 'macos' | 'windows' | 'web';

/**
 * 发布频道类型
 *
 * - stable: 稳定版频道，经过充分测试的正式版本
 * - beta: 测试版频道，包含最新功能但可能存在不稳定因素
 */
export type ReleaseChannel = 'stable' | 'beta';

/**
 * 版本信息基础接口
 *
 * 定义单个版本发布的核心信息，包含版本号、发布日期、下载链接和更新日志。
 * 用于 Beta 频道的版本列表中的每个版本项。
 *
 * @example
 * {
 *   version: "2.0.1-beta.1",
 *   date: "2026-03-28",
 *   downloadUrl: "https://example.com/download",
 *   changelogI18nKeys: ["download.release.beta.upcoming.light"]
 * }
 */
export interface VersionInfo {
  /** 版本号，遵循语义化版本规范 (SemVer)，如 "2.0.1-beta.1" */
  version: string;

  /** 版本发布日期，ISO 8601 格式 (YYYY-MM-DD) */
  date: string;

  /**
   * 应用下载链接
   * - 为空字符串时表示该版本暂未提供下载
   * - 应为直接下载链接或应用商店链接
   */
  downloadUrl: string;

  /**
   * 更新日志国际化键名数组
   * 每个键对应 i18n 文件中定义的多语言文本
   * @see i18n/en/code.json
   * @see i18n/zh-Hans/code.json
   */
  changelogI18nKeys: string[];
}

/**
 * 稳定版平台信息接口
 *
 * 稳定版中每个平台的信息，不包含版本号和日期
 * （因为 Stable 频道所有平台共享同一个版本号）。
 *
 * @remarks
 * 与 {@link VersionInfo} 不同，此接口省略了 version 和 date 字段，
 * 因为这些信息在 {@link StableRelease.channel} 级别统一管理。
 *
 * @example
 * {
 *   downloadUrl: "https://example.com/download",
 *   changelogI18nKeys: ["download.release.stable.upcoming"]
 * }
 */
export interface StablePlatformInfo {
  /**
   * 应用下载链接
   * - 为空字符串时表示该平台暂未发布
   * - 使用应用商店分发时，指向 App Store / Google Play 等
   */
  downloadUrl: string;

  /**
   * 更新日志国际化键名数组
   * 描述该版本在该平台上的更新内容
   */
  changelogI18nKeys: string[];
}

/**
 * 稳定版发布数据结构
 *
 * 描述 stable.json 文件的完整数据结构。
 * 稳定版采用单版本模式：所有平台共享同一个版本号。
 *
 * @example
 * {
 *   channel: "stable",
 *   updatedAt: "2026-03-18",
 *   version: "2.0.0",
 *   platforms: {
 *     android: { downloadUrl: "", changelogI18nKeys: [...] },
 *     ios: { downloadUrl: "", changelogI18nKeys: [...] },
 *     ...
 *   }
 * }
 */
export interface StableRelease {
  /** 固定为 "stable"，标识这是稳定版发布数据 */
  channel: 'stable';

  /** 数据最后更新时间，ISO 8601 格式 (YYYY-MM-DD) */
  updatedAt: string;

  /** 当前发布的版本号，所有平台共享此版本 */
  version: string;

  /**
   * 各平台的发布信息
   * 键为平台标识，值为该平台特定的发布信息
   * 某些平台可能为 null，表示该平台暂未发布此版本
   */
  platforms: Record<Platform, StablePlatformInfo | null>;
}

/**
 * 测试版平台版本列表
 *
 * Beta 频道中每个平台包含的版本列表。
 * 支持多版本，用于展示历史版本和提供旧版本下载。
 *
 * @remarks
 * 数组按发布时间倒序排列（最新版本在前），便于 UI 展示。
 * 空数组表示该平台暂无 Beta 版本发布。
 */
export type BetaPlatformVersions = VersionInfo[];

/**
 * 测试版发布数据结构
 *
 * 描述 beta.json 文件的完整数据结构。
 * 测试版采用多版本模式：每个平台可以有多个历史版本。
 *
 * @example
 * {
 *   channel: "beta",
 *   updatedAt: "2026-03-18",
 *   platforms: {
 *     windows: [
 *       { version: "2.0.1-beta.1", date: "2026-03-28", ... },
 *       { version: "2.0.0-beta.3", date: "2026-03-15", ... }
 *     ],
 *     web: [
 *       { version: "2.0.1-beta.1", date: "2026-03-28", ... }
 *     ],
 *     android: [],
 *     ...
 *   }
 * }
 */
export interface BetaRelease {
  /** 固定为 "beta"，标识这是测试版发布数据 */
  channel: 'beta';

  /** 数据最后更新时间，ISO 8601 格式 (YYYY-MM-DD) */
  updatedAt: string;

  /**
   * 各平台的版本列表
   * 每个平台对应一个版本数组，支持多版本历史
   */
  platforms: Record<Platform, BetaPlatformVersions>;
}

/**
 * 发布数据联合类型
 *
 * 可用于需要同时处理两种发布类型的场景。
 * 通过 channel 字段进行类型守卫（type guard）区分。
 *
 * @example
 * function processRelease(release: ReleaseData) {
 *   if (release.channel === 'stable') {
 *     // TypeScript 会推断 release 为 StableRelease
 *     console.log(release.version);
 *   } else {
 *     // TypeScript 会推断 release 为 BetaRelease
 *     console.log(release.platforms.windows[0]?.version);
 *   }
 * }
 */
export type ReleaseData = StableRelease | BetaRelease;

/**
 * Beta 平台数据便捷类型
 *
 * 用于需要直接操作 Beta 平台版本数据的场景。
 * 这是 BetaRelease.platforms 的快捷引用。
 *
 * @see BetaRelease.platforms
 */
export type BetaPlatforms = Record<Platform, BetaPlatformVersions>;

/**
 * 平台显示名称映射类型
 *
 * 用于存储各平台的本地化显示名称。
 *
 * @example
 * const platformLabels: PlatformLabels = {
 *   android: "Android",
 *   ios: "iOS",
 *   macos: "macOS",
 *   windows: "Windows",
 *   web: "Web"
 * };
 */
export type PlatformLabels = Record<Platform, string>;

/**
 * 版本信息摘要（用于 UI 展示）
 *
 * 从 VersionInfo 中提取核心字段，用于版本列表等 UI 组件。
 * 移除了可能不需要的完整 changelog 数组。
 */
export interface VersionSummary {
  /** 版本号 */
  version: string;
  /** 发布日期 */
  date: string;
  /** 下载链接 */
  downloadUrl: string;
}

/**
 * 平台发布状态
 *
 * 描述某个平台在特定频道下的发布状态，用于 UI 状态展示。
 */
export interface PlatformReleaseStatus {
  /** 平台标识 */
  platform: Platform;
  /** 是否有可用版本 */
  isAvailable: boolean;
  /** 最新版本号（如果有） */
  latestVersion?: string;
  /** 发布日期（如果有） */
  releaseDate?: string;
}
