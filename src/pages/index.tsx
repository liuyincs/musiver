import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import s from "./index.module.css";

const features = [
  {
    num: "01",
    title: "全平台覆盖",
    desc: "iOS、Android、macOS、Windows、Linux — 一次配置，处处聆听，体验始终如一。",
  },
  {
    num: "02",
    title: "多源连接",
    desc: "同时连接 Navidrome、Subsonic、Jellyfin 等多种 NAS 音乐服务器，统一管理。",
  },
  {
    num: "03",
    title: "品质至上",
    desc: "支持无损音频解码，搭配智能缓存与离线模式，聆听体验不打折。",
  },
];

export default function Home(): ReactNode {
  return (
    <Layout title="Musiver — 连接你的音乐" noFooter>
      <div className={s.wrapper}>
        <div className={s.guidelines}>
          <div className={`${s.guideline} ${s.guideV1}`} />
          <div className={`${s.guideline} ${s.guideV2}`} />
          <div className={`${s.guideline} ${s.guideH1}`} />
        </div>

        <section className={s.hero}>
          <div className={s.heroText}>
            <div className={s.colophon}>Musiver</div>
            <h1 className={s.title}>连接你的音乐</h1>
            <div className={s.divider} />
            <p className={s.subtitle}>
              Musiver 是一款跨平台 NAS 音乐播放器，支持多种服务器协议。
              在你的每一台设备上，享受私人音乐库的纯粹与丰盈。
            </p>
            <div className={s.buttons}>
              <Link className={s.btnPrimary} to="/docs/intro">
                ⬇ 立即下载
              </Link>
              <Link className={s.btnSecondary} to="/docs/intro">
                快速开始 →
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
                    alt="TV Interface"
                    className={s.placeholderArt}
                  />
                  <div className={s.placeholderText}>
                    <span className={s.phTitle}>Living Room TV</span>
                    <span className={s.phSubtitle}>
                      Now Playing: Dream it Possible
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
                        alt="Laptop Interface"
                        className={s.placeholderArt}
                      />
                      <div className={s.placeholderText}>
                        <span className={s.phTitle}>MacBook Pro</span>
                        <span className={s.phSubtitle}>Library Management</span>
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
                    alt="Phone Interface"
                    className={s.placeholderArt}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={s.features}>
          <div className={s.featuresHeader}>
            <span className={s.featuresLabel}>核心特性</span>
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
            "音乐是时间的艺术，Musiver 让这份艺术不受空间限制。"
          </p>
        </section>

        <footer className={s.footer}>
          © 2026 Musiver. All rights reserved.
        </footer>
      </div>
    </Layout>
  );
}
