import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '论文精读笔记',
  tagline: '推荐系统 · LLM · 自监督学习 · AI 科研自动化',
  favicon: 'img/favicon.ico',

  // future: { v4: true }, // Rspack native binding 在本地可能不兼容，CI 环境可按需开启

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
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          blogTitle: '论文精读笔记',
          blogDescription: '推荐系统、LLM、自监督学习、AI 科研自动化方向的论文精读记录',
          postsPerPage: 10,
          blogSidebarTitle: '最近精读',
          blogSidebarCount: 20,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
            title: '论文精读笔记',
            description: '推荐系统、LLM、自监督学习、AI 科研自动化方向的论文精读记录',
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

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '论文精读笔记',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/', label: '全部文章', position: 'left'},
        {to: '/tags', label: '标签', position: 'left'},
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
          title: '分类',
          items: [
            {label: '推荐系统', to: '/tags/推荐系统'},
            {label: 'LLM', to: '/tags/llm'},
            {label: '自监督学习', to: '/tags/自监督学习'},
            {label: 'AI 科研自动化', to: '/tags/ai科研自动化'},
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/W-void',
            },
            {
              label: 'RSS 订阅',
              href: 'pathname:///rss.xml',
            },
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
