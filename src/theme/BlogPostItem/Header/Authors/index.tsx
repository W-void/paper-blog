import React from 'react';
import styles from './styles.module.css';

const EMAIL = 'shuliw1996@gmail.com';

// 完全替换原生作者组件，显示邮箱 + 文章浏览量（不蒜子）
export default function BlogPostItemHeaderAuthors() {
  return (
    <div className={styles.metaBar}>
      <span className={styles.emailText}>✉️ {EMAIL}</span>
      {/* 不蒜子浏览量容器：id 固定，clientModule 会控制显示/隐藏 */}
      <span
        id="bsz-page-pv-container"
        className={styles.pvContainer}
        style={{ display: 'none' }}
      >
        <span className={styles.pvIcon}>👁</span>
        <span
          id="busuanzi_value_page_pv"
          className={styles.pvCount}
        >
          ...
        </span>
        <span className={styles.pvLabel}>次阅读</span>
      </span>
    </div>
  );
}
