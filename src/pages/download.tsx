import React, { useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";
import { SiAndroid, SiApple, SiHuawei } from "react-icons/si";
import { TbBrandWindowsFilled } from "react-icons/tb";
import { FiGlobe } from "react-icons/fi";
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

const platformIcons: Record<Platform, React.ReactNode> = {
  android: <SiAndroid className={s.platformIcon} />,
  harmony: <SiHuawei className={s.platformIcon} />,
  ios: <SiApple className={s.platformIcon} />,
  macos: <SiApple className={s.platformIcon} />,
  windows: <TbBrandWindowsFilled className={s.platformIcon} />,
  web: <FiGlobe className={s.platformIcon} />,
};

const PlatformIcon = ({ platform }: { platform: Platform }) => (
  <>{platformIcons[platform]}</>
);

const PlatformLabel = ({ platform }: { platform: Platform }) => {
  const labels: Record<Platform, string> = {
    android: translate({ id: "download.platform.android", message: "Android" }),
    harmony: translate({ id: "download.platform.harmony", message: "HarmonyOS" }),
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

  const platforms: Platform[] = ["android", "harmony", "ios", "macos", "windows", "web"];

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
