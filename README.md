# leafer-x-qrcode

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

Leafer UI 二维码插件, 根据文本自动生成二维码

## ✨ 特性

- 🎨 **自定义颜色** - 支持生成任意颜色的二维码
- 🌈 **渐变颜色** - 颜色支持 CSS 渐变字符串, 渐变解析工具：[@dy-kit/gradient-parser](https://www.npmjs.com/package/@dy-kit/gradient-parser)
- 🖼️ **图标支持** - 可在二维码中央添加自定义图标
- 🔧 **完全可配置** - 支持通过属性配置二维码内容、颜色、图标、图标尺寸
- 📦 **依赖二维码生成器** - [@dy-kit/qrcodegen](https://www.npmjs.com/package/@dy-kit/qrcodegen)

## 📦 安装

```bash
# pnpm
pnpm add leafer-x-qrcode @dy-kit/qrcodegen @dy-kit/gradient-parser
```

## 🚀 快速开始

### 基础使用

```typescript
import { App } from 'leafer-ui'
import { QRCode } from 'leafer-x-qrcode'

const app = new App({ view: 'app' })

const qrcode = new QRCode({
  text: 'Hello World',
  width: 200,
  height: 200,
  x: 100,
  y: 100
})

app.tree.add(qrcode)
```

### 自定义颜色

```typescript
const qrcode = new QRCode({
  text: 'Hello World',
  color: '#1e88e5',
  width: 200,
  height: 200,
  x: 100,
  y: 100
})
```

### 渐变颜色

```typescript
const qrcode = new QRCode({
  text: 'Gradient',
  // 支持标准 CSS 渐变字符串
  color: 'linear-gradient(45deg, #1e88e5, #e53935)',
  width: 200,
  height: 200,
})
```

### 带图标二维码

```typescript
const qrcode = new QRCode({
  text: 'Hello World',
  width: 100,
  height: 100,
  iconSrc: 'https://cn.vuejs.org/logo.svg',
  iconSize: 20,
  x: 100,
  y: 320,
  editable: true,
})
```

## 📖 API 文档

### QRCode 属性

继承自 Leafer UI 的 [Image](https://www.leaferjs.com/ui/api/image.html) 组件，拥有所有 Image 属性，并额外支持：

| 属性        | 类型     | 默认值      | 说明                  |
|-----------|--------|----------|---------------------|
| `text`    | string | `'<None>'` | 二维码内容               |
| `color`   | string | `'#000'`   | 二维码颜色（支持纯色或 CSS 渐变） |
| `iconSrc` | string | `null`     | 中心图标地址 （url、base64） |
| `iconSize`| number | `20`       | 中心图标尺寸(px)          |

## 🎯 核心特性

### 图标支持

支持在二维码中心添加自定义图标：

```typescript
const qrcode = new QRCode({
  text: 'Hello World',
  iconSrc: 'data:image/png;base64,iVBORw0KG...',
  iconSize: 30
})
```

## 💡 使用场景

- 🎫 活动门票二维码
- 📱 移动应用下载链接
- 🌐 网站链接分享
- 💰 支付二维码
- 🏷️ 产品信息展示
- 📢 社交媒体推广

## 🔗 相关链接

- [在线演示](https://leafer-x-qrcode.vercel.app/)
- [Leafer UI 文档](https://www.leaferjs.com/ui/guide/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## License

[MIT](./LICENSE) License © 2024-PRESENT [XiaDeYu](https://github.com/Xdy1579883916)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/leafer-x-qrcode?style=flat&colorA=080f12&colorB=1fa669

[npm-version-href]: https://npmjs.com/package/leafer-x-qrcode

[npm-downloads-src]: https://img.shields.io/npm/dm/leafer-x-qrcode?style=flat&colorA=080f12&colorB=1fa669

[npm-downloads-href]: https://npmjs.com/package/leafer-x-qrcode

[bundle-src]: https://img.shields.io/bundlephobia/minzip/leafer-x-qrcode?style=flat&colorA=080f12&colorB=1fa669&label=minzip

[bundle-href]: https://bundlephobia.com/result?p=leafer-x-qrcode

[license-src]: https://img.shields.io/github/license/Xdy1579883916/leafer-x-qrcode.svg?style=flat&colorA=080f12&colorB=1fa669

[license-href]: https://github.com/Xdy1579883916/leafer-x-qrcode/blob/master/LICENSE
