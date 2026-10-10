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
      message: "Nine platforms",
    }),
    desc: translate({
      id: "homepage.features.crossPlatform.desc",
      message:
        "iOS, Android, Android TV, macOS, tvOS, Windows, Linux, HarmonyOS and Web. Set up your server once and pick up where you left off anywhere.",
    }),
  },
  {
    num: "02",
    title: translate({
      id: "homepage.features.multiSource.title",
      message: "Many servers, many routes",
    }),
    desc: translate({
      id: "homepage.features.multiSource.desc",
      message:
        "Connect several servers at once. Give a server both a home and a remote address and Musiver picks the one that works. Playlists can move between servers.",
    }),
  },
  {
    num: "03",
    title: translate({
      id: "homepage.features.quality.title",
      message: "Sound and lyrics",
    }),
    desc: translate({
      id: "homepage.features.quality.desc",
      message:
        "Lossless playback, with transcoded quality when the network is slow. Word-by-word lyrics light up as the song plays, or fill the screen in immersive mode.",
    }),
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({
        id: "homepage.meta.title",
        message: "Musiver: connect your music server",
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
                Your music library, on every device
              </Translate>
            </h1>
            <div className={s.divider} />
            <p className={s.subtitle}>
              <Translate id="homepage.hero.subtitle">
                Musiver connects to the music server you already run: Navidrome,
                Subsonic, Jellyfin, Audiobookshelf and more. Open it on your
                phone, computer, TV or browser and it's the same library.
              </Translate>
            </p>
            <div className={s.buttons}>
              <Link className={s.btnPrimary} to="/download">
                <Translate id="homepage.hero.cta.download">Download</Translate>
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
              <Translate id="homepage.features.title">Features</Translate>
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
              The free version connects one server and streams your whole
              library. Membership is a one-time ¥58, for up to 7 devices, with
              future updates included. The price shown at checkout applies.
            </Translate>{" "}
            <Link className={s.membershipLink} to="/pricing">
              <Translate id="homepage.membership.link">Pricing</Translate>
            </Link>
          </p>
        </section>
      </div>
    </Layout>
  );
}
