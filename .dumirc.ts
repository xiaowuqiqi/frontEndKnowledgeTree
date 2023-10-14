import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'FEKT',
    footer: "Copyright © 2024 | Powered by <a href=\"https://d.umijs.org\" target=\"_blank\" rel=\"noreferrer\">dumi</a>",
  },
  publicPath: '/frontEndKnowledgeTree/',
  lessLoader: {
    strictMath: 'always',
  },
});
