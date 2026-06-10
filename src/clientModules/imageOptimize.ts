/**
 * 客户端模块：图片懒加载 + 渐进式加载 + 滚动进度条 + 不蒜子访问量统计
 *
 * Docusaurus clientModules 在每个页面渲染后执行，
 * 并在路由切换时通过 onRouteDidUpdate 重新执行。
 */

// ─── 滚动进度条 ───────────────────────────────────────────────────────────────
function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.body.style.setProperty('--scroll-progress', `${progress.toFixed(1)}%`);
}

// ─── 图片懒加载 ───────────────────────────────────────────────────────────────
function initLazyImages() {
  // 为 markdown 内的普通 <img> 添加懒加载和淡入效果
  const images = document.querySelectorAll<HTMLImageElement>('.markdown img:not([data-lazy-init])');

  if (images.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target as HTMLImageElement;
        img.classList.add('img-fade-in');

        if (img.complete && img.naturalHeight !== 0) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
          img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
        }
        observer.unobserve(img);
      });
    },
    { rootMargin: '120px 0px', threshold: 0 }
  );

  images.forEach((img) => {
    img.setAttribute('data-lazy-init', '1');
    // 添加 loading="lazy" 属性让浏览器原生懒加载
    if (!img.loading) {
      img.loading = 'lazy';
    }
    // 添加 decoding="async" 加快渲染
    img.decoding = 'async';
    observer.observe(img);
  });
}

// ─── 初始化入口 ──────────────────────────────────────────────────────────────
function init() {
  initLazyImages();
}

// ─── Docusaurus 生命周期钩子 ──────────────────────────────────────────────────
export function onRouteDidUpdate() {
  // 路由切换后重新初始化（SPA 导航）
  init();
  // 路由切换后延迟刷新不蒜子统计（等 DOM 渲染完毕）
  setTimeout(() => {
    initBusuanzi();
  }, 300);
}

// ─── 不蒜子访问量统计 ─────────────────────────────────────────────────────────
let busuanziLoaded = false;

/**
 * 加载不蒜子脚本（全局只加载一次）
 */
function loadBusuanzi(): Promise<void> {
  return new Promise((resolve) => {
    if (busuanziLoaded) {
      resolve();
      return;
    }
    const existing = document.getElementById('busuanzi-script');
    if (existing) {
      busuanziLoaded = true;
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'busuanzi-script';
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';
    script.onload = () => {
      busuanziLoaded = true;
      resolve();
    };
    script.onerror = () => resolve(); // 加载失败时静默处理
    document.head.appendChild(script);
  });
}

/**
 * 刷新当前页面浏览量显示
 * 不蒜子通过 busuanzi_value_page_pv 这个 id 的元素自动填入数字
 */
function refreshBusuanzi() {
  // 只在博客文章页（有 .blogPostPage 的页面）显示
  const isPostPage = !!document.querySelector('.blogPostPage');
  const container = document.getElementById('bsz-page-pv-container');
  if (!container) return;

  if (!isPostPage) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'inline-flex';

  // 不蒜子 SPA 刷新：手动触发重新统计
  // 通过清空再重设 busuanzi_value_page_pv 的内容来触发不蒜子重新读取
  const pvEl = document.getElementById('busuanzi_value_page_pv');
  if (pvEl) {
    pvEl.textContent = '...';
  }

  // 不蒜子会在脚本加载后自动填充，SPA 切换时需延迟等待
  if ((window as any).busuanzi) {
    try {
      (window as any).busuanzi.fetch();
    } catch (_) {
      // ignore
    }
  }
}

/**
 * 初始化不蒜子：加载脚本并在文章页显示浏览量
 */
async function initBusuanzi() {
  if (typeof window === 'undefined') return;
  await loadBusuanzi();
  // 延迟一帧，确保 DOM 已渲染
  requestAnimationFrame(() => {
    setTimeout(refreshBusuanzi, 100);
  });
}

// 注册滚动监听（只注册一次）
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  // 首次进入时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      initBusuanzi();
    });
  } else {
    // 稍微延迟确保 DOM 渲染完毕
    requestAnimationFrame(() => {
      init();
      initBusuanzi();
    });
  }
}
