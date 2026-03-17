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
      })}
      noFooter
    >
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
                Musiver is a cross-platform NAS music player that supports multiple
                server protocols. Enjoy the richness of your personal music library
                on every device you own.
              </Translate>
            </p>
            <div className={s.buttons}>
              <Link className={s.btnPrimary} to="/docs/intro">
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
            <div className={s.deviceScene}>
              {/* TV (Back) */}
              <div className={`${s.deviceFrame} ${s.tvDevice}`}>
                <div className={s.deviceScreen}>
                  <img
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
                    alt={translate({
                      id: "homepage.devices.tv.alt",
                      message: "TV Interface",
                    })}
                    className={s.placeholderArt}
                  />
                  <div className={s.placeholderText}>
                    <span className={s.phTitle}>
                      <Translate id="homepage.devices.tv.title">
                        Living Room TV
                      </Translate>
                    </span>
                    <span className={s.phSubtitle}>
                      <Translate id="homepage.devices.tv.subtitle">
                        Now Playing: Dream it Possible
                      </Translate>
                    </span>
                  </div>
                </div>
              </div>

              {/* Laptop (Middle Right) */}
              <div className={s.laptopDevice}>
                <div className={`${s.deviceFrame} ${s.laptopLid}`}>
                  <div className={s.laptopScreen}>
                    <div className={s.deviceScreen}>
                      <img
                        src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop"
                        alt={translate({
                          id: "homepage.devices.laptop.alt",
                          message: "Laptop Interface",
                        })}
                        className={s.placeholderArt}
                      />
                      <div className={s.placeholderText}>
                        <span className={s.phTitle}>
                          <Translate id="homepage.devices.laptop.title">
                            MacBook Pro
                          </Translate>
                        </span>
                        <span className={s.phSubtitle}>
                          <Translate id="homepage.devices.laptop.subtitle">
                            Library Management
                          </Translate>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={s.laptopBase}>
                  <div className={s.laptopTrackpad} />
                </div>
              </div>

              {/* Phone (Front Far Left) */}
              <div className={`${s.deviceFrame} ${s.phoneDevice}`}>
                <div className={s.deviceScreen}>
                  <img
                    src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop"
                    alt={translate({
                      id: "homepage.devices.phone.alt",
                      message: "Phone Interface",
                    })}
                    className={s.placeholderArt}
                  />
                </div>
              </div>
            </div>
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

        <footer className={s.footer}>
          <Translate id="homepage.footer">
            © 2026 Musiver. All rights reserved.
          </Translate>
        </footer>
      </div>
    </Layout>
  );
}
