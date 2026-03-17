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

const features = [
  {
    category: <Translate id="pricing.features.transfer.category">⚡️ Transfer & Playback</Translate>,
    items: [
      { name: <Translate id="pricing.features.transfer.item1">Listen & Save</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.transfer.item2">Auto Play</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.transfer.item3">Auto Download</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.transfer.item4">Sleep Timer</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.transfer.item5">Sync Data via QR</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.transfer.item6">Replay Gain</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.transfer.item7">Download Feature</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.transfer.item8">DLNA Playback</Translate>, free: false, pro: true, note: <Translate id="pricing.features.transfer.item8.note">Currently has poor compatibility, please assume unavailable</Translate> },
    ]
  },
  {
    category: <Translate id="pricing.features.lyrics.category">🎙️ Lyrics</Translate>,
    items: [
      { name: <Translate id="pricing.features.lyrics.item1">Lyrics Display & Edit</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.lyrics.item2">Desktop Lyrics (Android)</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.lyrics.item3">Status Bar Lyrics (Android/macOS)</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.lyrics.item4">PiP Lyrics (iOS)</Translate>, free: false, pro: true },
    ]
  },
  {
    category: <Translate id="pricing.features.system.category">📱 System Features</Translate>,
    items: [
      { name: <Translate id="pricing.features.system.item1">Desktop Widgets (Android/iOS)</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.system.item2">Global Hotkeys (macOS/Windows)</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.system.item3">Mini Window (macOS/Windows)</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.system.item4">CarPlay</Translate>, free: false, pro: true, note: <Translate id="pricing.features.system.item4.note">If APP is closed, music stops upon next open</Translate> },
      { name: <Translate id="pricing.features.system.item5">Shortcuts</Translate>, free: false, pro: true },
    ]
  },
  {
    category: <Translate id="pricing.features.personalization.category">🎈 Personalization</Translate>,
    items: [
      { name: <Translate id="pricing.features.personalization.item1">Enhanced Gestures</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.personalization.item2">Custom API</Translate>, free: true, pro: true },
      { name: <Translate id="pricing.features.personalization.item3">Custom Content</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.personalization.item4">Theme Switching</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.personalization.item5">Long Audio Preferences</Translate>, free: false, pro: true },
    ]
  },
  {
    category: <Translate id="pricing.features.library.category">📁 Library Management</Translate>,
    items: [
      { name: <Translate id="pricing.features.library.item1">Multi-server Switching</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.library.item2">Folder View (Library Mode)</Translate>, free: false, pro: true },
      { name: <Translate id="pricing.features.library.item3">Duplicate Detection (Library Mode)</Translate>, free: false, pro: true },
    ]
  },
  {
    category: <Translate id="pricing.features.others.category">🪄 Others</Translate>,
    items: [
      { name: <Translate id="pricing.features.others.item1">Backup Routes</Translate>, free: false, pro: true },
    ]
  }
];

export default function Pricing() {
  return (
    <Layout 
      title={translate({ id: 'pricing.meta.title', message: 'Pricing' })} 
      description={translate({ id: 'pricing.meta.desc', message: 'Musiver Pricing Plans' })}
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
              Basic features are forever free. Unlock advanced features with a one-time lifetime purchase.
            </Translate>
          </p>
        </div>

        <div className={styles.pricingCards}>
          {/* Free Plan */}
          <div className={styles.card}>
            <h2 className={styles.planName}>
              <Translate id="pricing.plan.free.name">Free User</Translate>
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
                Provides a complete basic music playback and transfer experience for daily listening.
              </Translate>
            </p>
            <Link to="/docs/intro" className={`${styles.actionBtn} ${styles.actionBtnFree}`}>
              <Translate id="pricing.plan.free.cta">Download for Free</Translate>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className={`${styles.card} ${styles.cardPro}`}>
            <h2 className={styles.planName}>
              <Translate id="pricing.plan.pro.name">Lifetime Member</Translate>
            </h2>
            <div className={styles.planPrice}>
              <span className={styles.planCurrency}>
                <Translate id="pricing.plan.pro.currency">¥</Translate>
              </span>
              58
            </div>
            <span className={styles.planPeriod}>
              <Translate id="pricing.plan.pro.period">One-time payment</Translate>
            </span>
            <div style={{ height: '16px' }}></div>
            <p className={styles.planDesc}>
              <Translate id="pricing.plan.pro.desc">
                One-time purchase, lifetime access across all platforms. Supports up to 7 devices simultaneously.
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
              <Translate id="pricing.table.header.pro">Pro</Translate>
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
                  {'It is a one-time purchase for lifetime access across all platforms. The membership can be used on up to 7 devices simultaneously. If the limit is exceeded, the membership on the earliest logged-in device will be automatically revoked.'}
                </Translate>
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <Translate id="pricing.faq.q2">How to purchase and refund?</Translate>
              </div>
              <div className={styles.faqAnswer}>
                <Translate id="pricing.faq.a2">
                  {'Currently available for purchase on mobile devices only:\n• iOS: Purchase via AppStore. Refunds can be requested through AppStore within 3 months (not controlled by the developer).\n• Android: Purchase via Alipay. Contact aqzscn@qq.com within 6 months for a refund (Alipay order number required).\n\nIt is recommended to bind an email after a successful purchase to restore it on other devices via email verification code (Email binding cannot be changed later, so do not use temporary emails).'}
                </Translate>
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <Translate id="pricing.faq.q3">Is internet connection required?</Translate>
              </div>
              <div className={styles.faqAnswer}>
                <Translate id="pricing.faq.a3">
                  {'Yes, membership verification uses online verification. Verification is triggered randomly upon startup, so please ensure your device can connect to the internet as much as possible.'}
                </Translate>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
