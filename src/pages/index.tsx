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
    <Layout title="Musiver — 品质音乐体验" noFooter>
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
              你的 NAS 音乐库
              <br />
              <span className={s.titleBold}>至臻聆听体验</span>
            </h1>
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
            <div className={s.desktopDevice}>
              <div className={s.desktopTopBar}>
                <span className={`${s.tbDot} ${s.tbDotR}`} />
                <span className={`${s.tbDot} ${s.tbDotY}`} />
                <span className={`${s.tbDot} ${s.tbDotG}`} />
              </div>
              <div className={s.desktopContent}>
                <div className={s.dSidebar}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={s.dSideItem}
                      style={{ width: `${55 + Math.random() * 45}%` }}
                    />
                  ))}
                </div>
                <div className={s.dMain}>
                  <div className={s.dAlbums}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={s.dAlbum} />
                    ))}
                  </div>
                  <div className={s.dPlayerStrip}>
                    <div className={s.dPlayIcon} />
                    <div className={s.dPlayProgress} />
                  </div>
                </div>
              </div>
            </div>

            <div className={s.phoneDevice}>
              <div className={s.phoneContent}>
                <div className={s.pArt} />
                <div className={s.pMeta}>
                  <div className={s.pLine} />
                  <div className={s.pLine} />
                </div>
                <div className={s.pControls}>
                  <div className={s.pBtn} />
                  <div className={s.pBtn} />
                  <div className={s.pBtn} />
                </div>
              </div>
            </div>

            <div className={s.tabletDevice}>
              <div className={s.tabletContent}>
                <div className={s.tArt} />
                <div className={s.tMeta}>
                  <div className={s.tLine} />
                  <div className={s.tLine} />
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
