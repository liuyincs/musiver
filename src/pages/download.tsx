import React, { useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";
import stableReleasesData from "../data/releases/stable.json";
import betaReleasesData from "../data/releases/beta.json";
import {
  Platform,
  ReleaseChannel,
  VersionInfo,
  StableRelease,
  BetaRelease,
  BetaPlatforms,
} from "../types/releases";
import s from "./download.module.css";

type ReleaseType = ReleaseChannel;

interface Releases {
  beta: BetaPlatforms;
}

const stableReleases = stableReleasesData as StableRelease;
const betaReleases = betaReleasesData as BetaRelease;

const releases: Releases = {
  beta: betaReleases.platforms,
};

const formatReleaseDate = (date: string, locale: string) => {
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};

const PlatformIcon = ({ platform }: { platform: Platform }) => {
  switch (platform) {
    case "android":
      return (
        <svg className={s.platformIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.523 15.3414C17.523 16.7112 16.3986 17.8227 15.0116 17.8227C13.6247 17.8227 12.5002 16.7112 12.5002 15.3414C12.5002 13.9716 13.6247 12.8601 15.0116 12.8601C16.3986 12.8601 17.523 13.9716 17.523 15.3414ZM8.98563 15.3414C8.98563 16.7112 7.86121 17.8227 6.47424 17.8227C5.08727 17.8227 3.96285 16.7112 3.96285 15.3414C3.96285 13.9716 5.08727 12.8601 6.47424 12.8601C7.86121 12.8601 8.98563 13.9716 8.98563 15.3414ZM21.9213 13.6338C21.7821 13.1166 21.2847 12.7876 20.7607 12.925L19.4996 13.2644C19.7828 12.1818 19.9388 11.0427 19.9388 9.85966C19.9388 8.65773 19.7774 7.5015 19.4842 6.40348L20.6975 4.29819C20.9387 3.87962 20.7932 3.34676 20.3697 3.10842C19.946 2.87008 19.4068 3.0139 19.1656 3.43247L17.8541 5.70783C16.1424 4.90821 14.1956 4.45339 12.1226 4.45339C10.0271 4.45339 8.06172 4.91896 6.33852 5.73604L5.03576 3.43247C4.79456 3.0139 4.25537 2.87008 3.8317 3.10842C3.40821 3.34676 3.26252 3.87962 3.50372 4.29819L4.72573 6.42171C4.43048 7.52353 4.26788 8.68352 4.26788 9.88975C4.26788 11.0917 4.42833 12.2478 4.71714 13.3456L3.4473 12.9808C2.92348 12.8434 2.42592 13.1724 2.28676 13.6897C2.1476 14.2069 2.48074 14.6986 3.00456 14.8359L4.4754 15.228C5.03473 19.1415 8.24354 22.1895 12.1226 22.1895C15.9818 22.1895 19.1751 19.1769 19.7523 15.2952L21.2036 14.9434C21.7274 14.806 22.0605 14.3144 21.9213 13.6338Z" />
        </svg>
      );
    case "ios":
      return (
        <svg className={s.platformIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.1504 14.8524C17.1725 12.5186 19.0883 11.2386 19.1834 11.1821C18.1408 9.68237 16.5188 9.45864 15.9592 9.4354C14.5828 9.29699 13.2514 10.2452 12.544 10.2452C11.8315 10.2452 10.7424 9.42113 9.5937 9.45289C8.08226 9.47466 6.69225 10.3308 5.92244 11.6677C4.34969 14.3942 5.53421 18.4288 7.07019 20.6471C7.82279 21.7336 8.7176 22.9566 9.89725 22.9157C11.0335 22.8711 11.4655 22.1887 12.8526 22.1887C14.218 22.1887 14.6288 22.9157 15.8273 22.8931C17.0683 22.8711 17.8532 21.7562 18.5913 20.6698C19.4447 19.4223 19.8038 18.2127 19.8242 18.147C19.7891 18.1344 16.9972 17.0673 17.1504 14.8524ZM15.0069 7.22239C15.6179 6.48316 16.0315 5.45543 15.9205 4.43457C15.0272 4.47039 13.9466 5.02973 13.3072 5.77673C12.7368 6.43549 12.2389 7.48386 12.3734 8.48782C13.3662 8.56475 14.3941 7.96263 15.0069 7.22239Z" />
        </svg>
      );
    case "macos":
      return (
        <svg className={s.platformIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.9998 3H4.99976C3.89976 3 2.99976 3.9 2.99976 5V17C2.99976 18.1 3.89976 19 4.99976 19H18.9998C20.0998 19 20.9998 18.1 20.9998 17V5C20.9998 3.9 20.0998 3 18.9998 3ZM11.9998 17C10.8998 17 9.99976 16.1 9.99976 15H13.9998C13.9998 16.1 13.0998 17 11.9998 17ZM18.9998 13H4.99976V5H18.9998V13Z" />
        </svg>
      );
    case "windows":
      return (
        <svg className={s.platformIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 5.47222L10.3725 4.4375V11.5361H3V5.47222ZM3 12.4639H10.3725V19.5625L3 18.5278V12.4639ZM11.451 4.28611L21 2.95V11.5361H11.451V4.28611ZM11.451 12.4639H21V21.05L11.451 19.7139V12.4639Z" />
        </svg>
      );
    case "web":
      return (
        <svg className={s.platformIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" />
        </svg>
      );
    default:
      return null;
  }
};

const PlatformLabel = ({ platform }: { platform: Platform }) => {
  const labels: Record<Platform, string> = {
    android: translate({ id: "download.platform.android", message: "Android" }),
    ios: translate({ id: "download.platform.ios", message: "iOS" }),
    macos: translate({ id: "download.platform.macos", message: "macOS" }),
    windows: translate({ id: "download.platform.windows", message: "Windows" }),
    web: translate({ id: "download.platform.web", message: "Web" }),
  };
  return <>{labels[platform]}</>;
};

export default function Download(): React.ReactNode {
  const { i18n } = useDocusaurusContext();
  const [releaseType, setReleaseType] = useState<ReleaseType>("stable");
  const [platform, setPlatform] = useState<Platform>("android");

  const platforms: Platform[] = ["android", "ios", "macos", "windows", "web"];

  const versions: VersionInfo[] =
    releaseType === "stable"
      ? stableReleases.platforms[platform]
        ? [
            {
              version: stableReleases.version,
              date: stableReleases.updatedAt,
              changelogI18nKeys:
                stableReleases.platforms[platform]?.changelogI18nKeys ?? [],
              downloadUrl: stableReleases.platforms[platform]?.downloadUrl ?? "",
            },
          ]
        : []
      : releases.beta[platform];

  const releaseTypeLabel =
    releaseType === "stable"
      ? translate({ id: "download.channel.stable", message: "Stable" })
      : translate({ id: "download.channel.beta", message: "Beta" });

  const handleReleaseTypeChange = (type: ReleaseType) => {
    setReleaseType(type);
  };

  return (
    <Layout
      title={translate({
        id: "download.meta.title",
        message: "Download Musiver",
      })}
      description={translate({
        id: "download.meta.desc",
        message: "Download Musiver for Android, iOS, macOS, Windows, and Web.",
      })}>
      <div className={s.wrapper}>
        <div className={s.guidelines}>
          <div className={`${s.guideline} ${s.guideV1}`} />
          <div className={`${s.guideline} ${s.guideV2}`} />
          <div className={`${s.guideline} ${s.guideH1}`} />
        </div>

        <section className={s.hero}>
          <div className={s.heroLeft}>
            <div className={s.colophon}>
              <Translate id="download.colophon">Get Musiver</Translate>
            </div>
            <h1 className={s.title}>
              <Translate id="download.title">Download</Translate>
            </h1>
            <div className={s.divider} />
            <p className={s.subtitle}>
              <Translate id="download.subtitle">
                Choose your platform and get started with the best NAS music
                player.
              </Translate>
            </p>

            <div className={s.platformList}>
              {platforms.map((p) => (
                <button
                  key={p}
                  className={clsx(
                    s.platformBtn,
                    platform === p && s.platformBtnActive,
                  )}
                  onClick={() => setPlatform(p)}>
                  <PlatformIcon platform={p} />
                  <PlatformLabel platform={p} />
                </button>
              ))}
            </div>
          </div>

          <div className={s.heroRight}>
            <div className={s.downloadCard}>
              <div className={s.cardHeader}>
                <div>
                  <h2 className={s.cardTitle}>
                    <PlatformLabel platform={platform} />
                  </h2>
                  <div className={s.cardMeta}>
                    {versions.length > 0 ? (
                      releaseType === "stable" ? (
                        <>
                          <span>
                            {translate(
                              {
                                id: "download.meta.version",
                                message: "Version {version}",
                              },
                              { version: versions[0].version },
                            )}
                          </span>
                          <span>
                            {translate(
                              {
                                id: "download.meta.updatedOn",
                                message: "Updated on {date}",
                              },
                              {
                                date: formatReleaseDate(
                                  versions[0].date,
                                  i18n.currentLocale,
                                ),
                              },
                            )}
                          </span>
                        </>
                      ) : (
                        <span>
                          {translate(
                            {
                              id: "download.meta.versionsAvailable",
                              message: "{count} versions available",
                            },
                            { count: versions.length },
                          )}
                        </span>
                      )
                    ) : (
                      <span>
                        {translate(
                          {
                            id: "download.meta.notAvailableChannel",
                            message: "Not available in {channel} channel",
                          },
                          { channel: releaseTypeLabel },
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className={s.toggleContainer}>
                  <button
                    className={clsx(
                      s.toggleBtn,
                      releaseType === "stable" && s.toggleBtnActive,
                    )}
                    onClick={() => handleReleaseTypeChange("stable")}>
                    <Translate id="download.channel.stable">Stable</Translate>
                  </button>
                  <button
                    className={clsx(
                      s.toggleBtn,
                      releaseType === "beta" && s.toggleBtnActive,
                    )}
                    onClick={() => handleReleaseTypeChange("beta")}>
                    <Translate id="download.channel.beta">Beta</Translate>
                  </button>
                </div>
              </div>

              {versions.length > 0 ? (
                <div className={s.versionsList}>
                  {versions.map((version, index) => (
                    <div
                      key={index}
                      className={clsx(
                        s.versionItem,
                        index > 0 && s.versionItemBorder,
                      )}>
                      {releaseType === "beta" && (
                        <div className={s.versionMetaInline}>
                          <span className={s.versionTag}>
                            v{version.version}
                          </span>
                          <span className={s.versionDate}>
                            {formatReleaseDate(
                              version.date,
                              i18n.currentLocale,
                            )}
                          </span>
                        </div>
                      )}

                      <div className={s.changelogTitle}>
                        <Translate id="download.whatsNew">What's New</Translate>
                      </div>
                      <ul className={s.changelogList}>
                        {version.changelogI18nKeys.map((item, i) => (
                          <li key={i} className={s.changelogItem}>
                            {translate({ id: item, message: item })}
                          </li>
                        ))}
                      </ul>

                      {version.downloadUrl.trim().length === 0 ? (
                        <button
                          className={clsx(s.downloadBtn, s.downloadBtnDisabled)}
                          type="button"
                          disabled>
                          <Translate id="download.comingSoon">
                            Coming Soon
                          </Translate>
                        </button>
                      ) : (
                        <Link
                          className={s.downloadBtn}
                          to={version.downloadUrl}>
                          {releaseType === "beta"
                            ? translate(
                                {
                                  id: "download.downloadVersion",
                                  message: "Download {version}",
                                },
                                { version: version.version },
                              )
                            : translate({
                                id: "download.downloadNow",
                                message: "Download Now",
                              })}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "var(--stone)",
                  }}>
                  {translate(
                    {
                      id: "download.meta.noReleaseForPlatform",
                      message:
                        "No release available for this platform in the {channel} channel.",
                    },
                    { channel: releaseTypeLabel },
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
