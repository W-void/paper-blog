import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  future: {
    faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      mdxCrossCompilerCache: true,
    },
  },
  title: 'W-void 的技术笔记',
  tagline: '论文精读 · 公众号 · 推荐系统日报',
  favicon: 'img/favicon.ico',

  url: 'https://w-void.github.io',
  baseUrl: '/paper-blog/',

  organizationName: 'W-void',
  projectName: 'paper-blog',
  trailingSlash: false,

  // 客户端模块：图片懒加载 + 滚动进度条
  clientModules: ['./src/clientModules/imageOptimize.ts'],

  onBrokenLinks: 'warn',
  markdown: {
    format: 'md',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        // preset 自带的 blog 插件用于「最近精读」，挂在根路径
        blog: {
          id: 'papers',
          path: 'blog-papers',
          routeBasePath: 'papers',
          showReadingTime: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          blogTitle: '最近精读',
          blogDescription: '推荐系统、LLM、自监督学习、AI 科研自动化方向的论文精读记录',
          postsPerPage: 10,
          blogSidebarTitle: '最近精读',
          blogSidebarCount: 20,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
            title: '最近精读',
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // 公众号文章
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'wechat',
        path: 'blog-wechat',
        routeBasePath: 'wechat',
        showReadingTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        blogTitle: '公众号',
        blogDescription: '公众号文章存档',
        postsPerPage: 10,
        blogSidebarTitle: '公众号文章',
        blogSidebarCount: 'ALL',
        feedOptions: {
          type: ['rss', 'atom'],
          xslt: true,
          title: '公众号文章',
        },
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'ignore',
      },
    ],
    // 论文翻译
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'translate',
        path: 'blog-translate',
        routeBasePath: 'translate',
        showReadingTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        blogTitle: '论文翻译',
        blogDescription: '精选论文中文翻译',
        postsPerPage: 10,
        blogSidebarTitle: '最近翻译',
        blogSidebarCount: 20,
        feedOptions: {
          type: ['rss', 'atom'],
          xslt: true,
          title: '论文翻译',
        },
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'ignore',
      },
    ],
    // 推荐系统日报
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'arxiv',
        path: 'blog-arxiv',
        routeBasePath: 'arxiv',
        showReadingTime: false,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        blogTitle: '推荐系统日报',
        blogDescription: '每日 arXiv 论文速览',
        postsPerPage: 10,
        blogSidebarTitle: '最近日报',
        blogSidebarCount: 30,
        feedOptions: {
          type: ['rss', 'atom'],
          xslt: true,
          title: '推荐系统日报',
        },
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'ignore',
      },
    ],
  ],

  stylesheets: [
    {
      href: '/paper-blog/katex.min.css',
      type: 'text/css',
    },
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'W-void',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/papers', label: '📄 最近精读', position: 'left'},
        {to: '/wechat', label: '📱 公众号·猫的薛定谔007', position: 'left'},
        {to: '/translate', label: '🌐 论文翻译', position: 'left'},
        {to: '/arxiv', label: '📰 推荐系统日报', position: 'left'},
        // {to: '/papers/tags', label: '🏷️ 标签', position: 'left'},
        {
          href: 'https://github.com/W-void/paper-blog',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '内容',
          items: [
            {label: '最近精读', to: '/papers'},
            {label: '公众号·猫的薛定谔007', to: '/wechat'},
            {label: '论文翻译', to: '/translate'},
            {label: '推荐系统日报', to: '/arxiv'},
          ],
        },
        {
          title: '精读标签',
          items: [
            {label: '推荐系统', to: '/papers/tags/推荐系统'},
            {label: 'LLM', to: '/papers/tags/llm'},
            {label: '自监督学习', to: '/papers/tags/自监督学习'},
            {label: 'AI 科研自动化', to: '/papers/tags/ai科研自动化'},
          ],
        },
        {
          title: '更多',
          items: [
            {label: 'GitHub', href: 'https://github.com/W-void'},
            {label: 'RSS 精读', href: 'pathname:///papers/rss.xml'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} W-void. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
