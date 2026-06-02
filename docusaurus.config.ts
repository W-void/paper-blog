import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'W-void 的技术笔记',
  tagline: '论文精读 · 公众号 · arXiv 日报',
  favicon: 'img/favicon.ico',

  url: 'https://w-void.github.io',
  baseUrl: '/paper-blog/',

  organizationName: 'W-void',
  projectName: 'paper-blog',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  markdown: {
    format: 'md',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
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
    // arXiv 日报
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'arxiv',
        path: 'blog-arxiv',
        routeBasePath: 'arxiv',
        showReadingTime: false,
        blogTitle: 'arXiv 日报',
        blogDescription: '每日 arXiv 论文速览',
        postsPerPage: 10,
        blogSidebarTitle: '最近日报',
        blogSidebarCount: 30,
        feedOptions: {
          type: ['rss', 'atom'],
          xslt: true,
          title: 'arXiv 日报',
        },
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'ignore',
      },
    ],
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
        {to: '/wechat', label: '📱 公众号', position: 'left'},
        {to: '/arxiv', label: '📰 arXiv 日报', position: 'left'},
        {to: '/papers/tags', label: '🏷️ 标签', position: 'left'},
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
            {label: '公众号', to: '/wechat'},
            {label: 'arXiv 日报', to: '/arxiv'},
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
