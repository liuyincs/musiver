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
      message: "Nine platforms, one library",
    }),
    desc: translate({
      id: "homepage.features.crossPlatform.desc",
      message:
        "iOS, Android, Android TV, macOS, tvOS, Windows, Linux, HarmonyOS and Web. Switch devices and it's still your library.",
    }),
  },
  {
    num: "02",
    title: translate({
      id: "homepage.features.multiSource.title",
      message: "Home or away, it switches for you",
    }),
    desc: translate({
      id: "homepage.features.multiSource.desc",
      message:
        "Give a server its home and remote addresses and Musiver picks the one that connects. Several servers can be connected at once.",
    }),
  },
  {
    num: "03",
    title: translate({
      id: "homepage.features.quality.title",
      message: "Every word on the beat",
    }),
    desc: translate({
      id: "homepage.features.quality.desc",
      message:
        "Lossless when you can, transcoded when the network is tight. Word-by-word lyrics light up with the melody, and fill the screen in immersive mode.",
    }),
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({
        id: "homepage.meta.title",
        message: "Musiver: your music, everywhere you are",
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
              <Translate id="homepage.hero.title">
                Your music, everywhere you are
              </Translate>
            </h1>
            <div className={s.divider} />
            <p className={s.subtitle}>
              <Translate id="homepage.hero.subtitle">
                Bring the whole library on your NAS to your phone, computer, TV
                and browser. Navidrome, Subsonic, Jellyfin, Audiobookshelf:
                connect and play.
              </Translate>
            </p>
            <div className={s.buttons}>
              <Link className={s.btnPrimary} to="/download">
                <Translate id="homepage.hero.cta.download">
                  Download free
                </Translate>
              </Link>
              <Link className={s.btnSecondary} to="/docs/intro">
                <Translate id="homepage.hero.cta.start">Quick start</Translate>
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
              <Translate id="homepage.features.title">Why Musiver</Translate>
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

        <section className={s.membership}>
          <p className={s.membershipText}>
            <Translate id="homepage.membership.text">
              The free version streams your whole library. Want more? A one-time
              ¥58 covers 7 devices and every future update. The price at
              checkout applies.
            </Translate>{" "}
            <Link className={s.membershipLink} to="/pricing">
              <Translate id="homepage.membership.link">
                See what membership adds
              </Translate>
            </Link>
          </p>
        </section>
      </div>
    </Layout>
  );
}
