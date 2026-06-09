import React from 'react';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const EMAIL = 'shuliw1996@gmail.com';

// 完全替换原生作者组件，只显示邮箱文字（不可点击）
export default function BlogPostItemHeaderAuthors() {
  return (
    <div className={styles.emailBar}>
      <span className={styles.emailText}>✉️ {EMAIL}</span>
    </div>
  );
}
