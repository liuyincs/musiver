import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import styles from './pricing.module.css';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.crossIcon}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ExtLink = ({ urlId, url, labelId, children }: { urlId: string; url: string; labelId: string; children: ReactNode }) => (
  <a href={translate({ id: urlId, message: url })} target="_blank" rel="noopener noreferrer">
    <Translate id={labelId}>{children}</Translate>
  </a>
);

type FeatureItem = {
  name: ReactNode;
  free: boolean;
  pro: boolean;
  note?: ReactNode;
};

const features: { category: ReactNode; items: FeatureItem[] }[] = [
  {
    category: <Translate id="pricing.features.basics.category">Basics</Translate>,
    items: [
      { name: <Translate id="pricing.features.basics.browse">Browse library</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.basics.stream">Stream all songs online</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.basics.oneServer">Connect one server</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.basics.sleep">Sleep timer</Translate>, free: true, pro: true },
    ],
  },
  {
    category: <Translate id="pricing.features.sound.category">Sound</Translate>,
    items: [
      { name: <Translate id="pricing.features.sound.equalizer">Equalizer</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.sound.replayGain">ReplayGain</Translate>, free: false, pro: true },
    ],
  },
  {
    category: <Translate id="pricing.features.lyrics.category">Lyrics</Translate>,
    items: [
      { name: <Translate id="pricing.features.lyrics.view">Lyrics view & search</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.lyrics.playbar">Player bar lyrics</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.lyrics.immersive">Immersive lyrics</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.lyrics.notification">Notification lyrics</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.lyrics.statusBar">Status bar lyrics</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.lyrics.desktop">Floating / desktop lyrics</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.lyrics.pip">PiP lyrics (iOS)</Translate>, free: false, pro: true },
    ],
  },
  {
    category: <Translate id="pricing.features.look.category">Look</Translate>,
    items: [
      { name: <Translate id="pricing.features.look.vinyl">Vinyl cover</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.look.playerBg">Player dynamic background</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.look.accent">Accent color</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.look.transparent">Transparent theme</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.look.appIcon">App icon (iOS)</Translate>, free: false, pro: true },
    ],
  },
  {
    category: <Translate id="pricing.features.anywhere.category">More scenarios</Translate>,
    items: [
      { name: <Translate id="pricing.features.anywhere.multiServer">Multi-server (2+)</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.anywhere.download">Offline download</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.anywhere.autoDownload">Auto-download</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.anywhere.carPlay">CarPlay (iPhone)</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.anywhere.shortcuts">Shortcuts (iOS)</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.anywhere.miniPlayer">Mini player (macOS / Windows)</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.anywhere.dlna">DLNA cast</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.anywhere.roaming">Music roaming</Translate>, free: false, pro: true },
    ],
  },
];

export default function Pricing() {
  return (
    <Layout
      title={translate({ id: 'pricing.meta.title', message: 'Pricing' })}
      description={translate({
        id: 'pricing.meta.desc',
        message: 'Musiver free plan and lifetime membership',
      })}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.colophon}>
            <Translate id="pricing.header.badge">Pricing</Translate>
          </div>
          <h1 className={styles.title}>
            <Translate id="pricing.header.title">Choose your plan</Translate>
          </h1>
          <p className={styles.subtitle}>
            <Translate id="pricing.header.subtitle">
              Connect your server and explore freely. Membership unlocks sound, look options, and more.
            </Translate>
          </p>
        </div>

        <div className={styles.pricingCards}>
          <div className={styles.card}>
            <h2 className={styles.planName}>
              <Translate id="pricing.plan.free.name">Free</Translate>
            </h2>
            <div className={styles.planPrice}>
              <span className={styles.planCurrency}>
                <Translate id="pricing.plan.free.currency">¥</Translate>
              </span>
              0
            </div>
            <span className={styles.planPeriod}>
              <Translate id="pricing.plan.free.period">Forever</Translate>
            </span>
            <div style={{ height: '16px' }}></div>
            <p className={styles.planDesc}>
              <Translate id="pricing.plan.free.desc">
                Browse the library, stream every song online, and connect one server. Includes multi-route auto switching, global hotkeys, and custom API.
              </Translate>
            </p>
            <Link to="/download" className={`${styles.actionBtn} ${styles.actionBtnFree}`}>
              <Translate id="pricing.plan.free.cta">Download for Free</Translate>
            </Link>
          </div>

          <div className={`${styles.card} ${styles.cardPro}`}>
            <h2 className={styles.planName}>
              <Translate id="pricing.plan.pro.name">Lifetime Member</Translate>
            </h2>
            <div className={styles.planPrice}>
              <span className={styles.planCurrency}>
                <Translate id="pricing.plan.pro.currency">¥</Translate>
              </span>
              88
            </div>
            <span className={styles.planPeriod}>
              <Translate id="pricing.plan.pro.period">One-time · price at payment prevails</Translate>
            </span>
            <div style={{ height: '16px' }}></div>
            <p className={styles.planDesc}>
              <Translate id="pricing.plan.pro.desc">
                One purchase for lifetime access across platforms, including later updates.
              </Translate>
            </p>
            <a href="#purchase-info" className={`${styles.actionBtn} ${styles.actionBtnPro}`}>
              <Translate id="pricing.plan.pro.cta">How to Purchase</Translate>
            </a>
          </div>
        </div>

        <div className={styles.tableSection}>
          <h2 className={styles.tableTitle}>
            <Translate id="pricing.table.title">Feature Comparison</Translate>
          </h2>

          <div className={styles.featureGrid}>
            <div className={styles.gridHeader}>
              <Translate id="pricing.table.header.feature">Features</Translate>
            </div>
            <div className={`${styles.gridHeader} ${styles.gridHeaderCenter}`}>
              <Translate id="pricing.table.header.free">Free</Translate>
            </div>
            <div className={`${styles.gridHeader} ${styles.gridHeaderCenter}`}>
              <Translate id="pricing.table.header.pro">Member</Translate>
            </div>
          </div>

          {features.map((section, idx) => (
            <div key={idx}>
              <div className={styles.featureCategory}>{section.category}</div>
              {section.items.map((item, itemIdx) => (
                <div className={styles.featureGrid} key={itemIdx}>
                  <div className={styles.featureName}>
                    {item.name}
                    {item.note && <span className={styles.featureNote}>* {item.note}</span>}
                  </div>
                  <div className={styles.featureCheck}>
                    {item.free ? <CheckIcon /> : <MinusIcon />}
                  </div>
                  <div className={styles.featureCheck}>
                    {item.pro ? <CheckIcon /> : <MinusIcon />}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.faqSection} id="purchase-info">
          <h2 className={styles.faqTitle}>
            <Translate id="pricing.faq.title">Purchase Guide</Translate>
          </h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <Translate id="pricing.faq.q1">What is the pricing model?</Translate>
              </div>
              <div className={styles.faqAnswer}>
                <Translate id="pricing.faq.a1">
                  {
                    'Lifetime membership: one purchase, all later updates included. Use it on up to 7 devices; if you exceed the limit, membership on the earliest device is revoked. Reference price ¥88 — the amount shown at payment time prevails.'
                  }
                </Translate>
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <Translate id="pricing.faq.q2">How to purchase and refund?</Translate>
              </div>
              <div className={styles.faqAnswer}>
                <Translate
                  id="pricing.faq.a2"
                  values={{
                    appleLink: (
                      <ExtLink
                        urlId="pricing.faq.a2.apple.url"
                        url="https://support.apple.com/en-us/118223"
                        labelId="pricing.faq.a2.apple.link"
                      >
                        Request a refund for apps or content that you bought from Apple
                      </ExtLink>
                    ),
                    googlePolicyLink: (
                      <ExtLink
                        urlId="pricing.faq.a2.googlePolicy.url"
                        url="https://support.google.com/googleplay/answer/2479637"
                        labelId="pricing.faq.a2.googlePolicy.link"
                      >
                        Learn about refunds on Google Play
                      </ExtLink>
                    ),
                    googleRefundLink: (
                      <ExtLink
                        urlId="pricing.faq.a2.googleRefund.url"
                        url="https://support.google.com/googleplay/answer/15574897"
                        labelId="pricing.faq.a2.googleRefund.link"
                      >
                        Request a refund on Google Play
                      </ExtLink>
                    ),
                    huaweiRefundLink: (
                      <ExtLink
                        urlId="pricing.faq.a2.huaweiRefund.url"
                        url="https://consumer.huawei.com/cn/support/content/zh-cn15987057/"
                        labelId="pricing.faq.a2.huaweiRefund.link"
                      >
                        How to request a refund for AppGallery in-app purchases
                      </ExtLink>
                    ),
                    huaweiTermsLink: (
                      <ExtLink
                        urlId="pricing.faq.a2.huaweiTerms.url"
                        url="https://consumer.huawei.com/minisite/cloudservice/iap/common/b0/latest/terms.htm"
                        labelId="pricing.faq.a2.huaweiTerms.link"
                      >
                        HUAWEI In-App Purchases Terms of Service
                      </ExtLink>
                    ),
                  }}
                >
                  {
                    'Channels:\n• iOS / Apple platforms: App Store. Refunds go through Apple under its policy (not controlled by the developer). See {appleLink}.\n• Android (Google Play): Refunds go through Google Play under its policy (not controlled by the developer). See {googlePolicyLink} and {googleRefundLink}.\n• HarmonyOS (Huawei IAP / AppGallery): Refunds go through Huawei under its policy (not controlled by the developer). See {huaweiTermsLink}.\n• Android (China / direct): Alipay. Within 6 months email aqzscn@qq.com with the Alipay order number.\n• Windows / Linux desktop: Alipay. Within 6 months email aqzscn@qq.com with the Alipay order number (same as Android Alipay).\n• Android TV: no in-app payment — buy on phone, then restore.\n• Web: no purchase UI.\n\nAfter purchase, bind an email to restore on other devices (binding cannot be changed; do not use a temporary email). App Store, Google Play, and Huawei purchases restore the same way. Legacy StreamMusic buyers must bind email in the old app first.'
                  }
                </Translate>
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <Translate id="pricing.faq.q3">Is internet connection required?</Translate>
              </div>
              <div className={styles.faqAnswer}>
                <Translate id="pricing.faq.a3">
                  {
                    'Yes. Membership uses online verification, triggered randomly at launch. Keep the device able to reach the internet when possible.'
                  }
                </Translate>
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <Translate id="pricing.faq.q4">Where is the full docs comparison?</Translate>
              </div>
              <div className={styles.faqAnswer}>
                <Translate id="pricing.faq.a4">
                  {
                    'See Docs → Membership for free vs member details, what changed from the old app, and restore steps. Some features still depend on the platform and device.'
                  }
                </Translate>
              </div>
            </div>
          </div>
          <p style={{ marginTop: 24, textAlign: 'center' }}>
            <Link to="/docs/membership/plans">
              <Translate id="pricing.docs.link">Open membership docs →</Translate>
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
