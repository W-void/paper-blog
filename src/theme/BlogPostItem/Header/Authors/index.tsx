import React from 'react';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function BlogPostItemHeaderAuthors() {
  const {
    metadata: { authors, date, readingTime },
    assets,
    isBlogPostPage,
  } = useBlogPost();

  if (authors.length === 0) return null;

  // 列表页只用简洁小头像行，不展开卡片
  if (!isBlogPostPage) {
    return (
      <div className={styles.compactRow}>
        {authors.map((author, idx) => {
          const imageURL = assets.authorsImageUrls?.[idx] ?? author.imageURL;
          const link = author.url || (author.email && `mailto:${author.email}`) || undefined;
          return (
            <span key={idx} className={styles.compactAuthor}>
              {imageURL && (
                <img src={imageURL} alt={author.name} className={styles.compactAvatar} />
              )}
              {link ? (
                <Link href={link} className={styles.compactName}>{author.name}</Link>
              ) : (
                <span className={styles.compactName}>{author.name}</span>
              )}
            </span>
          );
        })}
        {date && (
          <span className={styles.compactMeta}>
            · {new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        )}
        {readingTime && (
          <span className={styles.compactMeta}>· 约 {Math.ceil(readingTime)} 分钟</span>
        )}
      </div>
    );
  }

  // 文章详情页：展示完整作者卡片
  return (
    <div className={styles.authorCard}>
      {authors.map((author, idx) => {
        const imageURL = assets.authorsImageUrls?.[idx] ?? author.imageURL;
        const link = author.url || (author.email && `mailto:${author.email}`) || undefined;
        return (
          <div key={idx} className={styles.authorInner}>
            {imageURL && (
              <Link href={link ?? '#'} className={styles.avatarWrap}>
                <img src={imageURL} alt={author.name} className={styles.avatar} />
              </Link>
            )}
            <div className={styles.info}>
              <div className={styles.nameRow}>
                {link ? (
                  <Link href={link} className={styles.name}>{author.name}</Link>
                ) : (
                  <span className={styles.name}>{author.name}</span>
                )}
                {author.title && <span className={styles.badge}>{author.title}</span>}
              </div>
              <div className={styles.metaRow}>
                {date && (
                  <span className={styles.metaItem}>
                    🗓 {new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
                {readingTime && (
                  <span className={styles.metaItem}>⏱ 约 {Math.ceil(readingTime)} 分钟阅读</span>
                )}
              </div>
              <div className={styles.socialRow}>
                {author.url && (
                  <Link href={author.url} className={styles.socialLink}>
                    GitHub
                  </Link>
                )}
                {author.email && (
                  <Link href={`mailto:${author.email}`} className={styles.socialLink}>
                    邮箱
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
