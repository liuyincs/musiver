import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import s from './styles.module.css';

const features = [
  { icon: '📡', title: '多服务器', desc: 'Navidrome / Subsonic / Jellyfin 一 App 搞定，数据互通。' },
  { icon: '🖥️', title: '多平台', desc: '从手机到桌面，iOS / Android / macOS / Windows / Linux 全覆盖。' },
  { icon: '⚡', title: '极速体验', desc: '无损流传输、智能缓存、无缝播放，音质与速度兼得。' },
];

export default function Page4(): ReactNode {
  return (
    <Layout title="Musiver — ENTER THE GRID" noFooter>
      <div className={s.wrapper}>
        <div className={s.sun} />
        <div className={s.gridFloor} />

        <section className={s.hero}>
          <span className={s.glitch}>NAS MUSIC PLAYER</span>
          <h1 className={s.title}>
            MUSIVER
            <span className={s.titleGlow}>随处畅听</span>
          </h1>
          <p className={s.subtitle}>
            连接你的 NAS 音乐服务器，在任何设备上无缝播放你的私人音乐库。
            跨平台、多服务器、零延迟。
          </p>
          <div className={s.buttons}>
            <Link className={s.btnPrimary} to="/docs/intro">
              ⬇ 立即下载
            </Link>
            <Link className={s.btnSecondary} to="/docs/intro">
              快速开始 →
            </Link>
          </div>
        </section>

        <section className={s.showcase}>
          <div className={s.deviceDesktop}>
            <div className={s.desktopBar}>
              <span className={s.barText}>MUSIVER v2.0 — LIBRARY</span>
            </div>
            <div className={s.desktopScreen}>
              <div className={s.dSidebar}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={s.dSideItem} style={{ width: `${50 + Math.random() * 50}%` }} />
                ))}
              </div>
              <div className={s.dMain}>
                <div className={s.dAlbumGrid}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={s.dAlbum} />
                  ))}
                </div>
                <div className={s.dPlayer}>
                  <div className={s.dPlayThumb} />
                  <div className={s.dPlayBar} />
                </div>
              </div>
            </div>
          </div>

          <div className={s.deviceTablet}>
            <div className={s.tabletScreen}>
              <div className={s.tAlbumArt} />
              <div className={s.tLines}>
                <div className={s.tLine} />
                <div className={s.tLine} />
              </div>
            </div>
          </div>

          <div className={s.devicePhone}>
            <div className={s.phoneScreen}>
              <div className={s.pAlbum} />
              <div className={s.pLines}>
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
        </section>

        <section className={s.features}>
          {features.map((f, i) => (
            <div key={i} className={s.featureCard}>
              <span className={s.featureIcon}>{f.icon}</span>
              <div className={s.featureTitle}>{f.title}</div>
              <div className={s.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </section>

        <footer className={s.footer}>
          © 2026 MUSIVER — ALL RIGHTS RESERVED
        </footer>
      </div>
    </Layout>
  );
}
