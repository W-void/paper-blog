/**
 * 客户端模块：图片懒加载 + 渐进式加载 + 滚动进度条
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
}

// 注册滚动监听（只注册一次）
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  // 首次进入时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // 稍微延迟确保 DOM 渲染完毕
    requestAnimationFrame(init);
  }
}
