import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

interface ChannelCardProps {
  emoji: string;
  title: string;
  description: string;
  href: string;
  color: string;
}

function ChannelCard({ emoji, title, description, href, color }: ChannelCardProps) {
  return (
    <Link to={href} className={styles.channelCard} style={{ '--card-accent': color } as React.CSSProperties}>
      <div className={styles.channelEmoji}>{emoji}</div>
      <div className={styles.channelTitle}>{title}</div>
      <div className={styles.channelDesc}>{description}</div>
      <div className={styles.channelArrow}>→</div>
    </Link>
  );
}

const channels: ChannelCardProps[] = [
  {
    emoji: '📄',
    title: '最近精读',
    description: '推荐系统、LLM、自监督学习、AI 科研自动化方向的深度论文解析',
    href: '/papers',
    color: '#3b5bdb',
  },
  {
    emoji: '📱',
    title: '公众号文章',
    description: '公众号存档，技术随笔与论文串讲',
    href: '/wechat',
    color: '#0ca678',
  },
  {
    emoji: '🌐',
    title: '论文翻译',
    description: '精选论文完整中文翻译，保留公式与图注',
    href: '/translate',
    color: '#e67700',
  },
  {
    emoji: '📰',
    title: 'arXiv 日报',
    description: '每日精选 arXiv 速览，聚焦推荐与 LLM 方向',
    href: '/arxiv',
    color: '#9c36b5',
  },
];

const hotTopics = [
  { label: '推荐系统', href: '/papers/tags/推荐系统' },
  { label: 'LLM', href: '/papers/tags/llm' },
  { label: '自监督学习', href: '/papers/tags/自监督学习' },
  { label: 'AI 科研自动化', href: '/papers/tags/ai科研自动化' },
  { label: '生成式推荐', href: '/papers/tags/生成式推荐' },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroBadge}>技术笔记 · 持续更新</div>
            <h1 className={styles.heroTitle}>
              W-void 的<span className={styles.heroAccent}>论文精读</span>
            </h1>
            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
            <div className={styles.heroActions}>
              <Link to="/papers" className={styles.heroCta}>
                开始阅读
              </Link>
              <Link to="/arxiv" className={styles.heroSecondary}>
                今日日报 →
              </Link>
            </div>
          </div>
          <div className={styles.heroDecor} aria-hidden="true">
            <div className={styles.decor1} />
            <div className={styles.decor2} />
            <div className={styles.decor3} />
          </div>
        </section>

        {/* 频道卡片 */}
        <section className={styles.channels}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>内容分区</h2>
            <div className={styles.channelGrid}>
              {channels.map((c) => (
                <ChannelCard key={c.href} {...c} />
              ))}
            </div>
          </div>
        </section>

        {/* 热门标签 */}
        <section className={styles.topics}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>热门话题</h2>
            <div className={styles.topicList}>
              {hotTopics.map((t) => (
                <Link key={t.href} to={t.href} className={styles.topicTag}>
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
