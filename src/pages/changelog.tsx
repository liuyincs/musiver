import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import s from "./changelog.module.css";

type Platform = "android" | "ios" | "macos" | "windows" | "web";

interface PlatformLog {
  platform: Platform;
  changes: string[];
  downloadUrl?: string;
}

interface VersionLog {
  version: string;
  date: string;
  commonChanges?: string[];
  platforms: PlatformLog[];
}

const changelogData: VersionLog[] = [
  {
    version: "v1.2.0",
    date: "2023-11-16",
    commonChanges: ["Added support for Jellyfin servers"],
    platforms: [
      {
        platform: "macos",
        changes: [
          "Native Apple Silicon support",
          "Keyboard shortcuts for playback control",
          "Mini player mode",
        ],
        downloadUrl:
          "https://github.com/liuyincs/musiver/releases/download/v1.2.0/musiver-macos-1.2.0.dmg",
      },
      {
        platform: "windows",
        changes: [
          "System tray integration",
          "Media key support",
          "High DPI scaling improvements",
        ],
        downloadUrl:
          "https://github.com/liuyincs/musiver/releases/download/v1.2.0/musiver-windows-1.2.0.exe",
      },
      {
        platform: "ios",
        changes: [
          "Optimized battery usage during playback",
          "Fixed CarPlay integration bugs",
          "Smoother transitions in navigation",
        ],
        downloadUrl: "https://apps.apple.com/app/musiver",
      },
      {
        platform: "android",
        changes: [
          "Improved offline caching performance",
          "Fixed album art display issues on some devices",
          'New "Dark Night" theme option',
        ],
        downloadUrl:
          "https://github.com/liuyincs/musiver/releases/download/v1.2.0/musiver-android-1.2.0.apk",
      },
      {
        platform: "web",
        changes: [
          "PWA support - install as an app",
          "Improved responsiveness on mobile browsers",
          "Keyboard navigation support",
        ],
        downloadUrl: "https://app.musiver.cn",
      },
    ],
  },
  {
    version: "v1.1.0",
    date: "2023-09-20",
    platforms: [
      {
        platform: "macos",
        changes: [
          "Initial macOS release",
          "FLAC and ALAC playback support",
          "Dark mode support",
        ],
        downloadUrl:
          "https://github.com/liuyincs/musiver/releases/download/v1.1.0/musiver-macos-1.1.0.dmg",
      },
      {
        platform: "windows",
        changes: [
          "Initial Windows release",
          "FLAC and ALAC playback support",
          "Dark mode support",
        ],
        downloadUrl:
          "https://github.com/liuyincs/musiver/releases/download/v1.1.0/musiver-windows-1.1.0.exe",
      },
      {
        platform: "ios",
        changes: [
          "Gapless playback engine",
          "Lock screen widget and controls",
          "Performance improvements for large libraries",
        ],
        downloadUrl: "https://apps.apple.com/app/musiver",
      },
      {
        platform: "android",
        changes: [
          "Gapless playback engine",
          "Android Auto basic support",
          "Fix background playback termination",
        ],
        downloadUrl:
          "https://github.com/liuyincs/musiver/releases/download/v1.1.0/musiver-android-1.1.0.apk",
      },
      {
        platform: "web",
        changes: [
          "Initial web player beta",
          "Basic playback controls and queue management",
        ],
        downloadUrl: "https://app.musiver.cn",
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "2023-06-10",
    commonChanges: [
      "First stable release",
      "Subsonic & Navidrome API support",
      "Offline caching",
    ],
    platforms: [
      {
        platform: "ios",
        changes: [],
        downloadUrl: "https://apps.apple.com/app/musiver",
      },
      {
        platform: "android",
        changes: [],
        downloadUrl:
          "https://github.com/liuyincs/musiver/releases/download/v1.0.0/musiver-android-1.0.0.apk",
      },
    ],
  },
];

const PlatformIcon = ({
  platform,
  className,
}: {
  platform: Platform;
  className?: string;
}) => {
  switch (platform) {
    case "android":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.523 15.3414C17.523 16.7112 16.3986 17.8227 15.0116 17.8227C13.6247 17.8227 12.5002 16.7112 12.5002 15.3414C12.5002 13.9716 13.6247 12.8601 15.0116 12.8601C16.3986 12.8601 17.523 13.9716 17.523 15.3414ZM8.98563 15.3414C8.98563 16.7112 7.86121 17.8227 6.47424 17.8227C5.08727 17.8227 3.96285 16.7112 3.96285 15.3414C3.96285 13.9716 5.08727 12.8601 6.47424 12.8601C7.86121 12.8601 8.98563 13.9716 8.98563 15.3414ZM21.9213 13.6338C21.7821 13.1166 21.2847 12.7876 20.7607 12.925L19.4996 13.2644C19.7828 12.1818 19.9388 11.0427 19.9388 9.85966C19.9388 8.65773 19.7774 7.5015 19.4842 6.40348L20.6975 4.29819C20.9387 3.87962 20.7932 3.34676 20.3697 3.10842C19.946 2.87008 19.4068 3.0139 19.1656 3.43247L17.8541 5.70783C16.1424 4.90821 14.1956 4.45339 12.1226 4.45339C10.0271 4.45339 8.06172 4.91896 6.33852 5.73604L5.03576 3.43247C4.79456 3.0139 4.25537 2.87008 3.8317 3.10842C3.40821 3.34676 3.26252 3.87962 3.50372 4.29819L4.72573 6.42171C4.43048 7.52353 4.26788 8.68352 4.26788 9.88975C4.26788 11.0917 4.42833 12.2478 4.71714 13.3456L3.4473 12.9808C2.92348 12.8434 2.42592 13.1724 2.28676 13.6897C2.1476 14.2069 2.48074 14.6986 3.00456 14.8359L4.4754 15.228C5.03473 19.1415 8.24354 22.1895 12.1226 22.1895C15.9818 22.1895 19.1751 19.1769 19.7523 15.2952L21.2036 14.9434C21.7274 14.806 22.0605 14.3144 21.9213 13.6338Z" />
        </svg>
      );
    case "ios":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.1504 14.8524C17.1725 12.5186 19.0883 11.2386 19.1834 11.1821C18.1408 9.68237 16.5188 9.45864 15.9592 9.4354C14.5828 9.29699 13.2514 10.2452 12.544 10.2452C11.8315 10.2452 10.7424 9.42113 9.5937 9.45289C8.08226 9.47466 6.69225 10.3308 5.92244 11.6677C4.34969 14.3942 5.53421 18.4288 7.07019 20.6471C7.82279 21.7336 8.7176 22.9566 9.89725 22.9157C11.0335 22.8711 11.4655 22.1887 12.8526 22.1887C14.218 22.1887 14.6288 22.9157 15.8273 22.8931C17.0683 22.8711 17.8532 21.7562 18.5913 20.6698C19.4447 19.4223 19.8038 18.2127 19.8242 18.147C19.7891 18.1344 16.9972 17.0673 17.1504 14.8524ZM15.0069 7.22239C15.6179 6.48316 16.0315 5.45543 15.9205 4.43457C15.0272 4.47039 13.9466 5.02973 13.3072 5.77673C12.7368 6.43549 12.2389 7.48386 12.3734 8.48782C13.3662 8.56475 14.3941 7.96263 15.0069 7.22239Z" />
        </svg>
      );
    case "macos":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.9998 3H4.99976C3.89976 3 2.99976 3.9 2.99976 5V17C2.99976 18.1 3.89976 19 4.99976 19H18.9998C20.0998 19 20.9998 18.1 20.9998 17V5C20.9998 3.9 20.0998 3 18.9998 3ZM11.9998 17C10.8998 17 9.99976 16.1 9.99976 15H13.9998C13.9998 16.1 13.0998 17 11.9998 17ZM18.9998 13H4.99976V5H18.9998V13Z" />
        </svg>
      );
    case "windows":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 5.47222L10.3725 4.4375V11.5361H3V5.47222ZM3 12.4639H10.3725V19.5625L3 18.5278V12.4639ZM11.451 4.28611L21 2.95V11.5361H11.451V4.28611ZM11.451 12.4639H21V21.05L11.451 19.7139V12.4639Z" />
        </svg>
      );
    case "web":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" />
        </svg>
      );
    default:
      return null;
  }
};

const PlatformLabel = ({ platform }: { platform: Platform }) => {
  const labels: Record<Platform, string> = {
    android: "Android",
    ios: "iOS",
    macos: "macOS",
    windows: "Windows",
    web: "Web",
  };
  return <>{labels[platform]}</>;
};

export default function Changelog() {
  return (
    <Layout
      title={translate({ id: "changelog.meta.title", message: "Changelog" })}
      description={translate({
        id: "changelog.meta.desc",
        message: "Musiver release notes and version history.",
      })}>
      <div className={s.wrapper}>
        <div className={s.guidelines}>
          <div className={`${s.guideline} ${s.guideV1}`} />
          <div className={`${s.guideline} ${s.guideV2}`} />
        </div>

        <header className={s.header}>
          <div className={s.colophon}>
            <Translate id="changelog.colophon">Updates</Translate>
          </div>
          <h1 className={s.title}>
            <Translate id="changelog.title">Release Notes</Translate>
          </h1>
          <p className={s.subtitle}>
            <Translate id="changelog.subtitle">
              Discover what's new in Musiver. We constantly update the app to
              bring you the best cross-platform music experience.
            </Translate>
          </p>
        </header>

        <main className={s.timeline}>
          {changelogData.map((versionLog) => (
            <section key={versionLog.version} className={s.versionBlock}>
              <div className={s.versionHeader}>
                <h2 className={s.versionTitle}>{versionLog.version}</h2>
                <div className={s.versionDate}>{versionLog.date}</div>
              </div>

              {versionLog.commonChanges && versionLog.commonChanges.length > 0 && (
                <div className={s.commonSection}>
                  <div className={s.commonHeader}>
                    <svg
                      className={s.platformIcon}
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className={s.commonLabel}>
                      <Translate id="changelog.common">
                        General Updates
                      </Translate>
                    </span>
                  </div>
                  <ul className={s.changeList}>
                    {versionLog.commonChanges.map((change, idx) => (
                      <li key={idx} className={s.changeItem}>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={s.platformsGrid}>
                {versionLog.platforms.map(
                  (platformLog) =>
                    platformLog.changes.length > 0 && (
                      <div
                        key={platformLog.platform}
                        className={s.platformSection}>
                        <div className={s.platformHeader}>
                          <PlatformIcon
                            platform={platformLog.platform}
                            className={s.platformIcon}
                          />
                          <h3 className={s.platformName}>
                            <PlatformLabel platform={platformLog.platform} />
                          </h3>
                        </div>
                        <ul className={s.changeList}>
                          {platformLog.changes.map((change, idx) => (
                            <li key={idx} className={s.changeItem}>
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                )}
              </div>

              <div className={s.downloadsSection}>
                <div className={s.downloadsTitle}>
                  <Translate id="changelog.download.title">Download</Translate>{" "}
                  {versionLog.version}
                </div>
                <div className={s.downloadButtons}>
                  {versionLog.platforms.map(
                    (platformLog) =>
                      platformLog.downloadUrl && (
                        <Link
                          key={platformLog.platform}
                          to={platformLog.downloadUrl}
                          className={s.downloadBtn}
                          target="_blank"
                          rel="noopener noreferrer">
                          <PlatformIcon
                            platform={platformLog.platform}
                            className={s.downloadBtnIcon}
                          />
                          <PlatformLabel platform={platformLog.platform} />
                        </Link>
                      ),
                  )}
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>
    </Layout>
  );
}
