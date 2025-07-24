import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/help/',
  outDir: '../http-trick/site/help',
  title: "Http Trick帮助文档",
  description: "Http代理工具，专注于修改HTTP请求\\响应",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '证书安装', link: '/docs/cert/README.md' }
    ],

    sidebar: [
      { text: 'Proxy安装', link: '/docs/install/README.md' },
      { text: '证书安装', link: '/docs/cert/README.md' },
      { text: 'Http-Trick 配置', link: '/docs/config/README.md' },
      { text: 'host配置', link: '/docs/host/README.md' },
      { text: '规则配置', link: '/docs/rule/README.md' },
      { text: '工程路径配置', link: '/docs/project/README.md' },
      { text: '自定义mock数据管理', link: '/docs/data_manage/README.md' },
      { text: '监控窗', link: '/docs/monitor/README.md' },
      { text: 'WebSocket Mock', link: '/docs/websocket_mock/README.md' },
      { text: 'chrome代理配置', link: '/docs/chrome/README.md' },
      { text: '手机代理配置', link: '/docs/phone/README.md' },
      {
        text: '内部机制',
        items: [
          { text: '理论', link: '/docs/internal/README.md' },
          { text: '代理流程', link: '/docs/internal/proxy.md' },
          { text: 'ws调试', link: '/docs/internal/ws-debug.md' },
        ]
      },
      { text: '常见问题', link: '/docs/question/README.md' },
      { text: 'iOS根证书安装说明', link: '/docs/mobile/ios.md' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tsxuehu/http-trick' }
    ]
  }
})
