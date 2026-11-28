import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";
import { SiAndroid, SiApple, SiHuawei, SiLinux } from "react-icons/si";
import { TbBrandWindowsFilled } from "react-icons/tb";
import { FiGlobe, FiX } from "react-icons/fi";
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
  apple: <SiApple className={s.platformIcon} />,
  windows: <TbBrandWindowsFilled className={s.platformIcon} />,
  linux: <SiLinux className={s.platformIcon} />,
  web: <FiGlobe className={s.platformIcon} />,
};

const PlatformIcon = ({ platform }: { platform: Platform }) => (
  <>{platformIcons[platform]}</>
);

const PlatformLabel = ({ platform }: { platform: Platform }) => {
  const labels: Record<Platform, string> = {
    android: translate({ id: "download.platform.android", message: "Android" }),
    harmony: translate({
      id: "download.platform.harmony",
      message: "HarmonyOS",
    }),
    apple: translate({
      id: "download.platform.apple",
      message: "iOS/macOS/tvOS",
    }),
    windows: translate({ id: "download.platform.windows", message: "Windows" }),
    linux: translate({ id: "download.platform.linux", message: "Linux" }),
    web: translate({ id: "download.platform.web", message: "Web" }),
  };
  return <>{labels[platform]}</>;
};

const TESTFLIGHT_EMAIL = "support@musiver.cn";

function TestFlightApplication({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const subject = translate({
    id: "download.testflight.subject",
    message: "Apply for Musiver TestFlight",
  });
  return (
    <dialog
      ref={dialogRef}
      className={s.testFlightDialog}
      aria-labelledby="testflight-title"
      aria-describedby="testflight-intro">
      <header className={s.testFlightHeader}>
        <h2 id="testflight-title">
          <Translate id="download.testflight.title">Apply for TestFlight access</Translate>
        </h2>
        <form method="dialog">
          <button
            type="submit"
            className={s.testFlightClose}
            aria-label={translate({ id: "download.testflight.close", message: "Close" })}>
            <FiX aria-hidden="true" />
          </button>
        </form>
      </header>
      <p id="testflight-intro">
        <Translate id="download.testflight.intro">TestFlight access is available to paid Musiver members. To request an invitation, email us with the subject and information below.</Translate>
      </p>
      <dl className={s.testFlightMail}>
        <div>
          <dt><Translate id="download.testflight.to">To</Translate></dt>
          <dd>{TESTFLIGHT_EMAIL}</dd>
        </div>
        <div>
          <dt><Translate id="download.testflight.subjectLabel">Subject</Translate></dt>
          <dd>{subject}</dd>
        </div>
      </dl>
      <ul className={s.testFlightRequirements}>
        <li><Translate id="download.testflight.receipt">Proof of membership purchase: a screenshot of your Apple receipt or Alipay order with the order number clearly visible.</Translate></li>
        <li><Translate id="download.testflight.account">The email address for your Apple Account, where you’ll receive the invitation.</Translate></li>
        <li><Translate id="download.testflight.server">The type of music server you usually use.</Translate></li>
      </ul>
      <p><Translate id="download.testflight.wait">We review requests periodically. Please wait for an email after applying.</Translate></p>
      <a className={clsx(s.downloadBtn, s.testFlightSend)} href={`mailto:${TESTFLIGHT_EMAIL}?subject=${encodeURIComponent(subject)}`}>
        <Translate id="download.testflight.send">Open email app</Translate>
      </a>
    </dialog>
  );
}

export default function Download(): React.ReactNode {
  const { i18n } = useDocusaurusContext();
  const [releaseType, setReleaseType] = useState<ReleaseType>("stable");
  const [platform, setPlatform] = useState<Platform>("android");
  const testFlightDialog = useRef<HTMLDialogElement>(null);
  const isAppleBeta = platform === "apple" && releaseType === "beta";
  // 测试版默认只展开最新版本，更早的版本折叠成一行（蓝图「共通·状态」）。
  const [expandedVersions, setExpandedVersions] = useState<number[]>([0]);

  useEffect(() => {
    setExpandedVersions([0]);
  }, [platform, releaseType]);

  const platforms: Platform[] = [
    "android",
    "harmony",
    "apple",
    "windows",
    "linux",
    "web",
  ];

  const stablePlatform = stableReleases.platforms[platform];
  const versions: VersionInfo[] =
    releaseType === "stable"
      ? stablePlatform
        ? [
            {
              version: stablePlatform.release?.version ?? stableReleases.version,
              date: stablePlatform.release?.date ?? stableReleases.updatedAt,
              changelogI18nKeys: stablePlatform.changelogI18nKeys ?? [],
              downloadUrl: stablePlatform.downloadUrl ?? "",
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
        message:
          "Download Musiver for Android, HarmonyOS, iOS, macOS, Apple TV, Windows, Linux, and Web.",
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
                              id:
                                versions.length === 1
                                  ? "download.meta.oneVersionAvailable"
                                  : "download.meta.versionsAvailable",
                              message:
                                versions.length === 1
                                  ? "1 version available"
                                  : "{count} versions available",
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
                  {versions.map((version, index) => {
                    const isLatest = index === 0;
                    const showDetails =
                      releaseType === "stable" ||
                      expandedVersions.includes(index);
                    const unavailable = version.downloadUrl.trim().length === 0;
                    const downloadLabel =
                      releaseType === "beta"
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
                          });
                    const compactLabel = translate({
                      id: "download.downloadShort",
                      message: "Download",
                    });
                    const downloadAction = (
                      compact: boolean,
                    ) =>
                      isAppleBeta ? (
                        <button
                          className={clsx(
                            s.downloadBtn,
                            s.downloadBtnCompact,
                            isLatest && s.downloadBtnCompactPrimary,
                          )}
                          type="button"
                          aria-haspopup="dialog"
                          onClick={(event) => {
                            event.currentTarget.focus();
                            testFlightDialog.current?.showModal();
                          }}>
                          <Translate id="download.testflight.apply">Apply</Translate>
                        </button>
                      ) : unavailable ? (
                        <button
                          className={clsx(
                            s.downloadBtn,
                            compact && s.downloadBtnCompact,
                            s.downloadBtnDisabled,
                          )}
                          type="button"
                          disabled>
                          <Translate id="download.comingSoon">
                            Coming Soon
                          </Translate>
                        </button>
                      ) : (
                        <Link
                          className={clsx(
                            s.downloadBtn,
                            compact && s.downloadBtnCompact,
                            compact && isLatest && s.downloadBtnCompactPrimary,
                          )}
                          to={version.downloadUrl}>
                          {compact ? compactLabel : downloadLabel}
                          {!compact && (
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
                          )}
                        </Link>
                      );

                    return (
                      <div
                        key={index}
                        className={clsx(
                          s.versionItem,
                          index > 0 && s.versionItemBorder,
                        )}>
                        {releaseType === "beta" && (
                          <div className={s.versionRow}>
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
                            <div className={s.versionRowActions}>
                              {downloadAction(true)}
                              <button
                                type="button"
                                className={s.expandBtn}
                                aria-expanded={showDetails}
                                onClick={() =>
                                  setExpandedVersions((prev) =>
                                    prev.includes(index)
                                      ? prev.filter((i) => i !== index)
                                      : [...prev, index],
                                  )
                                }>
                                {showDetails ? (
                                  <Translate id="download.hideChanges">
                                    Hide changes
                                  </Translate>
                                ) : (
                                  <Translate id="download.showChanges">
                                    What's new
                                  </Translate>
                                )}
                                <svg
                                  className={clsx(
                                    s.expandIcon,
                                    showDetails && s.expandIconOpen,
                                  )}
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true">
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}

                        {showDetails && (
                          <>
                            <div className={s.changelogTitle}>
                              <Translate id="download.whatsNew">
                                What's New
                              </Translate>
                            </div>
                            <ul className={s.changelogList}>
                              {version.changelogI18nKeys.map((item, i) => (
                                <li key={i} className={s.changelogItem}>
                                  {translate({ id: item, message: item })}
                                </li>
                              ))}
                            </ul>

                            {releaseType === "stable" && downloadAction(false)}
                          </>
                        )}
                      </div>
                    );
                  })}
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
        {isAppleBeta && <TestFlightApplication dialogRef={testFlightDialog} />}
      </div>
    </Layout>
  );
}
