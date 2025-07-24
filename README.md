# Bytebase 登录页面

这是一个基于 React + TypeScript + Vite 构建的 Bytebase 风格登录页面，支持响应式设计，适配桌面端和移动端。

## 功能特性

- **Bytebase 风格设计** - 完全还原 Bytebase 官方登录页面的视觉设计
- **响应式布局** - 完美适配桌面、平板和手机等各种设备
- **多种登录方式** - 支持 Google、GitHub、Microsoft Account 和邮箱登录
- **现代化技术栈** - 使用 React 18、TypeScript、Vite 等最新技术
- **TypeScript 支持** - 完整的类型定义，提供更好的开发体验
- **深色模式支持** - 自动适配系统深色模式偏好
- **无障碍访问** - 遵循 WCAG 无障碍访问标准
- **性能优化** - 优化的打包配置和加载性能

## 技术栈

- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **CSS3** - 现代化样式和动画
- **ESLint** - 代码质量检查

## 项目结构

```
BytebaseLogIn/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx      # 登录页面主组件
│   │   └── LoginPage.css      # 登录页面样式
│   ├── App.tsx                # 应用主组件
│   ├── main.tsx              # 应用入口
│   └── index.css             # 全局样式
├── public/                   # 静态资源
├── package.json             # 项目配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
└── README.md               # 项目说明

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
