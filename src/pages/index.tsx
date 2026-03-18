import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import s from "./index.module.css";

const features = [
  {
    num: "01",
    title: translate({
      id: "homepage.features.crossPlatform.title",
      message: "Cross-Platform Coverage",
    }),
    desc: translate({
      id: "homepage.features.crossPlatform.desc",
      message:
        "iOS, Android, macOS, Windows, and Linux — set it up once and enjoy your music everywhere with a consistent experience.",
    }),
  },
  {
    num: "02",
    title: translate({
      id: "homepage.features.multiSource.title",
      message: "Multi-Source Connectivity",
    }),
    desc: translate({
      id: "homepage.features.multiSource.desc",
      message:
        "Connect to multiple NAS music servers at the same time, including Navidrome, Subsonic, and Jellyfin, and manage them in one place.",
    }),
  },
  {
    num: "03",
    title: translate({
      id: "homepage.features.quality.title",
      message: "Quality First",
    }),
    desc: translate({
      id: "homepage.features.quality.desc",
      message:
        "Supports lossless audio decoding with smart caching and offline mode, so your listening quality is never compromised.",
    }),
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({
        id: "homepage.meta.title",
        message: "Musiver — Connect Your Music",
      })}>
      <div className={s.wrapper}>
        <div className={s.guidelines}>
          <div className={`${s.guideline} ${s.guideV1}`} />
          <div className={`${s.guideline} ${s.guideV2}`} />
          <div className={`${s.guideline} ${s.guideH1}`} />
        </div>

        <section className={s.hero}>
          <div className={s.heroText}>
            <div className={s.colophon}>Musiver</div>
            <h1 className={s.title}>
              <Translate id="homepage.hero.title">Connect Your Music</Translate>
            </h1>
            <div className={s.divider} />
            <p className={s.subtitle}>
              <Translate id="homepage.hero.subtitle">
                Musiver is a cross-platform NAS music player that supports
                multiple server protocols. Enjoy the richness of your personal
                music library on every device you own.
              </Translate>
            </p>
            <div className={s.buttons}>
              <Link className={s.btnPrimary} to="/download">
                <Translate id="homepage.hero.cta.download">
                  ⬇ Download Now
                </Translate>
              </Link>
              <Link className={s.btnSecondary} to="/docs/intro">
                <Translate id="homepage.hero.cta.start">
                  Quick Start →
                </Translate>
              </Link>
            </div>
          </div>

          <div className={s.heroDevices}>
            <img
              src="/img/devices/musiver-devices.png"
              alt={translate({
                id: "homepage.devices.image.alt",
                message: "Musiver devices preview",
              })}
              className={s.heroDevicesImage}
            />
          </div>
        </section>

        <section className={s.features}>
          <div className={s.featuresHeader}>
            <span className={s.featuresLabel}>
              <Translate id="homepage.features.title">Core Features</Translate>
            </span>
            <div className={s.featuresLine} />
          </div>
          <div className={s.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} className={s.featureCard}>
                <span className={s.featureNum}>{f.num}</span>
                <div className={s.featureTitle}>{f.title}</div>
                <div className={s.featureDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className={s.quote}>
          <p className={s.quoteText}>
            <Translate id="homepage.quote">
              "Music is the art of time, and Musiver lets that art move beyond
              space."
            </Translate>
          </p>
        </section>

      </div>
    </Layout>
  );
}
