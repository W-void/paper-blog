import React from 'react';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const DEFAULT_EMAIL = 'shuliw1996@gmail.com';

export default function BlogPostItemHeaderAuthors() {
  const { isBlogPostPage } = useBlogPost();

  // 列表页不显示
  if (!isBlogPostPage) return null;

  return (
    <div className={styles.emailBar}>
      <Link href={`mailto:${DEFAULT_EMAIL}`} className={styles.emailLink}>
        ✉️ {DEFAULT_EMAIL}
      </Link>
    </div>
  );
}
