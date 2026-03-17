import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import s from './styles.module.css';

function DeviceDesktop() {
  return (
    <div className={s.deviceDesktop}>
      <div className={s.desktopScreen}>
        <div className={s.screenNav}>
          <div className={s.screenNavDot} />
          <div className={s.screenNavBar} />
        </div>
        <div className={s.screenContent}>
          <div className={s.screenSidebar}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={s.sidebarItem} style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
          </div>
          <div className={s.screenMain}>
            <div className={s.albumGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={s.albumThumb} />
              ))}
            </div>
            <div className={s.playerBar}>
              <div className={s.playerThumb} />
              <div className={s.playerInfo}>
                <div className={s.playerLine} />
                <div className={s.playerLine} />
              </div>
              <div className={s.playerProgress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceTablet() {
  return (
    <div className={s.deviceTablet}>
      <div className={s.tabletScreen}>
        <div className={s.tabletAlbumArt} />
        <div className={s.tabletLines}>
          <div className={s.tabletLine} />
          <div className={s.tabletLine} />
        </div>
      </div>
    </div>
  );
}

function DevicePhone() {
  return (
    <div className={s.devicePhone}>
      <div className={s.phoneScreen}>
        <div className={s.phoneAlbum} />
        <div className={s.phoneLines}>
          <div className={s.phoneLine} />
          <div className={s.phoneLine} />
        </div>
        <div className={s.phoneControls}>
          <div className={s.phoneBtn} />
          <div className={s.phoneBtn} />
          <div className={s.phoneBtn} />
        </div>
      </div>
    </div>
  );
}

const features = [
  { icon: '🖥️', title: '多平台支持', desc: 'iOS、Android、macOS、Windows、Linux 全覆盖，一处配置，处处可听。' },
  { icon: '🗄️', title: '多服务器支持', desc: '同时连接 Navidrome、Subsonic、Jellyfin 等多种 NAS 音乐服务器。' },
  { icon: '🎧', title: '极致播放体验', desc: '无缝切换、无损音频、智能缓存，让你专注于音乐本身。' },
];

export default function Page1(): ReactNode {
  return (
    <Layout title="Musiver — 你的 NAS 音乐，随处可听" noFooter>
      <div className={s.wrapper}>
        <section className={s.hero}>
          <span className={s.badge}>
            <span className={s.badgeDot} />
            跨平台 NAS 音乐播放器
          </span>
          <h1 className={s.title}>
            你的音乐库
            <br />
            <span className={s.titleAccent}>随处可听</span>
          </h1>
          <p className={s.subtitle}>
            Musiver 连接你的 NAS 音乐服务器，在任何设备上畅享私人音乐库。
            多服务器、多平台、零妥协。
          </p>
          <div className={s.buttons}>
            <Link className={s.btnPrimary} to="/docs/intro">
              ⬇ 立即下载
            </Link>
            <Link className={s.btnSecondary} to="/docs/intro">
              → 快速开始
            </Link>
          </div>
        </section>

        <section className={s.showcase}>
          <DeviceDesktop />
          <DeviceTablet />
          <DevicePhone />
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
          © 2026 Musiver. All rights reserved.
        </footer>
      </div>
    </Layout>
  );
}
