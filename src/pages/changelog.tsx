import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { SiAndroid, SiApple, SiHuawei, SiLinux } from "react-icons/si";
import { TbBrandWindowsFilled } from "react-icons/tb";
import { FiGlobe } from "react-icons/fi";
import history from "../data/releases/stable-history.json";
import type { Platform } from "../types/releases";
import s from "./changelog.module.css";

interface StableLog {
  version: string;
  date: string;
  platforms: Partial<Record<Platform, string[]>>;
}

const entries: StableLog[] = [...history].sort((a, b) => b.date.localeCompare(a.date));
const icons = {
  android: SiAndroid,
  harmony: SiHuawei,
  apple: SiApple,
  windows: TbBrandWindowsFilled,
  linux: SiLinux,
  web: FiGlobe,
};

export default function Changelog() {
  const { i18n } = useDocusaurusContext();
  const dateFormat = new Intl.DateTimeFormat(i18n.currentLocale, {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
  const labels: Record<Platform, string> = {
    android: translate({ id: "download.platform.android", message: "Android" }),
    harmony: translate({ id: "download.platform.harmony", message: "HarmonyOS" }),
    apple: translate({ id: "download.platform.apple", message: "iOS/macOS/tvOS" }),
    windows: translate({ id: "download.platform.windows", message: "Windows" }),
    linux: translate({ id: "download.platform.linux", message: "Linux" }),
    web: translate({ id: "download.platform.web", message: "Web" }),
  };

  return (
    <Layout
      title={translate({ id: "changelog.meta.title", message: "Changelog" })}
      description={translate({ id: "changelog.meta.desc", message: "Release notes and version history for stable Musiver releases." })}>
      <div className={s.wrapper}>
        <div className={s.guidelines}>
          <div className={`${s.guideline} ${s.guideV1}`} />
          <div className={`${s.guideline} ${s.guideV2}`} />
        </div>
        <header className={s.header}>
          <div className={s.colophon}>
            <Translate id="changelog.colophon">Updates</Translate>
          </div>
          <h1 className={s.title}><Translate id="changelog.title">Release Notes</Translate></h1>
          <p className={s.subtitle}>
            <Translate id="changelog.subtitle">See what changed in each stable release of Musiver.</Translate>
          </p>
        </header>
        <div className={s.timeline}>
          {entries.map(({ version, date, platforms }) => (
            <section key={version} className={s.versionBlock}>
              <div className={s.versionHeader}>
                <h2 className={s.versionTitle}>v{version}</h2>
                <time dateTime={date} className={s.versionDate}>{dateFormat.format(new Date(date))}</time>
              </div>
              <div className={s.platformsGrid}>
                {(Object.keys(icons) as Platform[]).map((platform) => {
                  const changes = platforms[platform];
                  if (!changes?.length) return null;
                  const Icon = icons[platform];
                  return (
                    <div key={platform} className={s.platformSection}>
                      <div className={s.platformHeader}>
                        <Icon className={s.platformIcon} aria-hidden="true" />
                        <h3 className={s.platformName}>{labels[platform]}</h3>
                      </div>
                      <ul className={s.changeList}>
                        {changes.map((key) => (
                          <li key={key} className={s.changeItem}>{translate({ id: key, message: key })}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
          <div className={s.downloadsSection}>
            <Link to="/download" className={s.downloadBtn}>
              <Translate id="changelog.download.title">Go to downloads</Translate>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
