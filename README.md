# myVtuberLite

浏览器里的 VTuber 套皮：用摄像头和 MediaPipe Holistic 追踪脸、手和身体，驱动 Three.js + `@pixiv/three-vrm` 里的 VRM 模型。默认进入工作室页面。

## 本地开发

需要 Node.js 20 或 22。仓库根目录的 `.node-version` 写的是 `22`，和 Cloudflare Pages 当前默认构建镜像一致。

```bash
npm ci
npm run dev
```

开发服务器是 `http://localhost:5173/`。

`/api` 会代理到 `http://127.0.0.1:5000`。这个后端不在本仓库里。没有后端、也没有登录 token 时，工作室使用内置的 Miku2 / Miku 模型和默认背景图。

## 本地生产构建

```bash
npm ci
npm run build
npm run preview
```

- 构建命令：`npm run build`（先 `vue-tsc`，再 `vite build`）
- 输出目录：`dist/`
- 预览地址：`http://localhost:4173/`

`npm run build` 会把运行时资源拷进 `dist`：

- `source/`（VRM 和背景图）→ `dist/source/`
- `@mediapipe/holistic` 的 wasm / 模型 → `dist/mediapipe/holistic/`
- `@mediapipe/camera_utils` 和 `@mediapipe/drawing_utils` → `dist/mediapipe/` 下对应目录

MediaPipe 这些文件是挂到全局变量上的传统脚本。`index.html` 用普通 `<script>` 加载它们，而不是打进 Vite 的包里。打进包之后 `Camera` / `Holistic` 会丢，追踪起不来。

## 部署到 Cloudflare Pages

在 Cloudflare 控制台自己创建 Pages 项目并连接这个 Git 仓库。本仓库不会替你打开或修改 Pages / GitHub Pages 设置。

站点要发在项目根路径上，例如 `https://<你的项目名>.pages.dev/`，不要放在 `/dist` 子路径下。

| 设置 | 填写 |
| --- | --- |
| 框架预设 | Vue |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| 根目录（Root directory） | `/`（仓库根目录，留空也一样） |
| Node.js | `22`。已提供 `.node-version`，Pages 会读取。旧构建镜像如果没读到这个文件，在环境变量里加 `NODE_VERSION` = `22` |
| 环境变量 | 没有必须填写的变量 |

依赖安装使用仓库里的 `package-lock.json`（Pages 会执行 `npm ci`）。`.npmrc` 里打开了 `legacy-peer-deps`，否则 `@pixiv/three-vrm@1.0.6` 和 `three@0.147` 的 peer 冲突会让 `npm ci` 失败。

### 路由

应用使用 Vue Router 的 history 模式，目前只有 `/`（工作室）。

Cloudflare Pages 在**没有**顶层 `404.html` 时，会把打不到静态文件的路径回退到站点根目录，前端路由可以接着处理。请不要在项目里加 `404.html`。

也不要加这种 `_redirects`：

```txt
/* /index.html 200
```

Pages 的 `_redirects` 会盖过已经存在的静态文件，上面这条规则会把 JS、CSS、VRM 和 wasm 请求都改成首页，站点会坏掉。

## 部署之后怎么用

1. 用浏览器打开 Pages 给的 HTTPS 地址。摄像头只能在 HTTPS（或 localhost）下使用。
2. 允许摄像头权限。不需要麦克风。
3. 默认加载内置的 Miku2。右侧可以切换 Miku / Miku2、纯色或默认背景、face / half / full 取景，以及摄像头预览的位置和开关。
4. 建议用桌面版 Chrome 或 Edge。模型大约 15MB，第一次打开要等它下完。

## 限制

- 登录、用户自己的模型库、背景库和上传，都依赖仓库外的后端。开发时代理会把 `/api` 原样转到 `http://127.0.0.1:5000`（`vite.config.ts` 里的 `rewrite` 正则是 `/^\api/`，匹配不到以 `/api` 开头的路径，所以前缀不会被删掉）。Pages 上没有这个后端。没有 token，或接口请求失败时，工作室继续用内置模型和背景。
- 路由里的登录页、首页、模型分享和背景分享在这次修改之前就是注释掉的，静态部署同样不会打开它们。
- MediaPipe 的 `pose_landmark_heavy.tflite` 大约 27MB，超过 Pages 单文件 25 MiB 的上限，构建时会跳过。工作室用的是 `modelComplexity: 1`（`pose_landmark_full.tflite`），不需要这个 heavy 文件。
- 内置模型只包括 `source/humanModel/Miku2.vrm` 和 `source/humanModel/Miku.vrm`。已登录并且后端可用时，侧边栏仍会改用接口返回的列表，模型地址为 `/api/file/download/<id>/0`。
