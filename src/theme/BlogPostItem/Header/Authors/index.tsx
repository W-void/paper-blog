import React from 'react';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const DEFAULT_AUTHOR = {
  name: 'W-void',
  title: '作者',
  url: 'https://github.com/W-void',
  imageURL: 'https://github.com/W-void.png',
  email: 'shuliw1996@gmail.com',
};

export default function BlogPostItemHeaderAuthors() {
  const {
    metadata: { authors: rawAuthors, date, readingTime },
    assets,
    isBlogPostPage,
  } = useBlogPost();

  // 没有 authors 时 fallback 到默认作者
  const authors = rawAuthors.length > 0 ? rawAuthors : [DEFAULT_AUTHOR];

  // 列表页：只显示紧凑小行
  if (!isBlogPostPage) {
    return (
      <div className={styles.compactRow}>
        {authors.map((author, idx) => {
          const imageURL =
            (rawAuthors.length > 0 ? assets.authorsImageUrls?.[idx] : null) ??
            author.imageURL;
          return (
            <span key={idx} className={styles.compactAuthor}>
              {imageURL && (
                <img src={imageURL} alt={author.name} className={styles.compactAvatar} />
              )}
              <span className={styles.compactName}>{author.name}</span>
            </span>
          );
        })}
      </div>
    );
  }

  // 文章详情页：完整作者卡片，重点展示邮箱
  return (
    <div className={styles.authorCard}>
      {authors.map((author, idx) => {
        const imageURL =
          (rawAuthors.length > 0 ? assets.authorsImageUrls?.[idx] : null) ??
          author.imageURL;
        return (
          <div key={idx} className={styles.authorInner}>
            {/* 头像 */}
            {imageURL && (
              <Link href={author.url ?? `mailto:${author.email}`} className={styles.avatarWrap}>
                <img src={imageURL} alt={author.name} className={styles.avatar} />
              </Link>
            )}

            {/* 信息区 */}
            <div className={styles.info}>
              {/* 姓名 + 标签 */}
              <div className={styles.nameRow}>
                <span className={styles.name}>{author.name}</span>
                {author.title && <span className={styles.badge}>{author.title}</span>}
              </div>

              {/* 邮箱（重点显示） */}
              {author.email && (
                <div className={styles.emailRow}>
                  <Link href={`mailto:${author.email}`} className={styles.emailLink}>
                    ✉️ {author.email}
                  </Link>
                </div>
              )}

              {/* 日期 + 阅读时间 */}
              <div className={styles.metaRow}>
                {date && (
                  <span className={styles.metaItem}>
                    🗓 {new Date(date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                )}
                {readingTime && (
                  <span className={styles.metaItem}>
                    ⏱ 约 {Math.ceil(readingTime)} 分钟阅读
                  </span>
                )}
              </div>

              {/* GitHub 链接 */}
              <div className={styles.socialRow}>
                {author.url && (
                  <Link href={author.url} className={styles.socialLink}>
                    GitHub →
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
