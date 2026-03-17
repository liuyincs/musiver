import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import s from './styles.module.css';

const features = [
  { emoji: '🌍', title: '全平台覆盖', desc: 'iOS、Android、macOS、Windows、Linux 随心切换，音乐从不中断。' },
  { emoji: '🔗', title: '多源聚合', desc: '一个 App 连接 Navidrome、Subsonic、Jellyfin 等多种服务器。' },
  { emoji: '✨', title: '精致体验', desc: '原生级 UI 设计，搭配无损解码与智能缓存，让聆听成为享受。' },
];

export default function Page2(): ReactNode {
  return (
    <Layout title="Musiver — 温暖你的音乐生活" noFooter>
      <div className={s.wrapper}>
        <div className={s.blob1} />
        <div className={s.blob2} />
        <div className={s.blob3} />

        <section className={s.hero}>
          <div className={s.heroText}>
            <span className={s.tag}>NAS 音乐播放器</span>
            <h1 className={s.title}>
              让你的音乐
              <br />
              <span className={s.titleItalic}>温暖每一刻</span>
            </h1>
            <p className={s.subtitle}>
              Musiver 将你 NAS 中珍藏的每一首歌，带到你手边的每一台设备。
              多服务器无缝切换，音乐从不中断。
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
              <div className={s.desktopBar}>
                <span className={`${s.dot} ${s.dotR}`} />
                <span className={`${s.dot} ${s.dotY}`} />
                <span className={`${s.dot} ${s.dotG}`} />
              </div>
              <div className={s.desktopContent}>
                <div className={s.dSidebar}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={s.dSideItem} style={{ width: `${55 + Math.random() * 45}%` }} />
                  ))}
                </div>
                <div className={s.dMain}>
                  <div className={s.dGrid}>
                    {Array.from({ length: 6 }).map((_, i) => (
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

            <div className={s.phoneDevice}>
              <div className={s.phoneContent}>
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

            <div className={s.tabletDevice}>
              <div className={s.tabletContent}>
                <div className={s.tAlbumArt} />
                <div className={s.tInfo}>
                  <div className={s.tLine} />
                  <div className={s.tLine} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={s.features}>
          {features.map((f, i) => (
            <div key={i} className={s.featureCard}>
              <div className={s.featureEmoji}>{f.emoji}</div>
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
