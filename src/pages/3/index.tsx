import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import s from './styles.module.css';

const tickerText =
  ' ★ MUSIVER — NAS MUSIC PLAYER ★ MULTI-PLATFORM ★ MULTI-SERVER ★ iOS ★ ANDROID ★ macOS ★ WINDOWS ★ LINUX ★ NAVIDROME ★ SUBSONIC ★ JELLYFIN ★ ';

const features = [
  { num: '01', title: '多平台', desc: 'iOS / Android / macOS / Windows / Linux — 一个 App，覆盖所有设备。' },
  { num: '02', title: '多服务器', desc: 'Navidrome / Subsonic / Jellyfin — 同时连接，统一管理，随心切换。' },
  { num: '03', title: '零延迟', desc: '本地缓存 + 无损解码 + 无缝播放 — 给你唱片店级别的聆听体验。' },
];

export default function Page3(): ReactNode {
  return (
    <Layout title="Musiver — RAW MUSIC POWER" noFooter>
      <div className={s.wrapper}>
        <div className={s.ticker}>
          <div className={s.tickerInner}>
            {tickerText}{tickerText}
          </div>
        </div>

        <section className={s.hero}>
          <span className={s.heroNumber}>M</span>
          <div className={s.heroTop}>
            <span className={s.heroLabel}>Cross-Platform NAS Player</span>
          </div>
          <h1 className={s.title}>
            YOUR NAS.
            <span className={s.titleRed}>YOUR MUSIC.</span>
            EVERYWHERE.
          </h1>
          <p className={s.subtitle}>
            Musiver 把你 NAS 中的私人音乐库，带到你的每一台设备。
            跨平台、多服务器、零妥协。
          </p>
          <div className={s.buttons}>
            <Link className={s.btnPrimary} to="/docs/intro">
              ↓ 立即下载
            </Link>
            <Link className={s.btnSecondary} to="/docs/intro">
              → 快速开始
            </Link>
          </div>
        </section>

        <section className={s.devicesSection}>
          <div className={s.devicesLabel}>
            DEVICE PREVIEW
          </div>
          <div className={s.devicesGrid}>
            <div className={s.deviceDesktop}>
              <div className={s.desktopBar}>
                <span className={s.barTitle}>MUSIVER — LIBRARY</span>
              </div>
              <div className={s.desktopScreen}>
                <div className={s.dSidebar}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={s.dSideItem} style={{ width: `${50 + Math.random() * 50}%` }} />
                  ))}
                </div>
                <div className={s.dMain}>
                  <div className={s.dAlbumGrid}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={s.dAlbum} />
                    ))}
                  </div>
                  <div className={s.dPlayerBar}>
                    <div className={s.dPlayIcon} />
                    <div className={s.dPlayProgress} />
                  </div>
                </div>
              </div>
            </div>

            <div className={s.deviceTablet}>
              <div className={s.tabletScreen}>
                <div className={s.tAlbumBig}>
                  <span className={s.tPlaySymbol}>▶</span>
                </div>
                <div className={s.tMeta}>
                  <div className={s.tLine} />
                  <div className={s.tLine} />
                </div>
              </div>
            </div>

            <div className={s.devicePhone}>
              <div className={s.phoneScreen}>
                <div className={s.pAlbum} />
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
          </div>
        </section>

        <section className={s.features}>
          {features.map((f, i) => (
            <div key={i} className={s.featureCard}>
              <span className={s.featureNum}>{f.num}</span>
              <div className={s.featureTitle}>{f.title}</div>
              <div className={s.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </section>

        <footer className={s.footer}>
          © 2026 Musiver — All rights reserved
        </footer>
      </div>
    </Layout>
  );
}
