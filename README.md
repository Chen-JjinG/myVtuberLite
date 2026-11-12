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

## 部署到 Cloudflare Workers

控制台里这个项目会被识别成 **Vite Worker**（Workers Builds），不是带 Vue 预设的旧版 Pages。构建本身可以成功，但默认的 `npx wrangler deploy` 在没有 Wrangler 配置时会尝试自动安装 Cloudflare 的 Vite 插件，而那个流程要求 Vite 6 以上。本仓库是 Vite 4，所以会报：

`The version of Vite used in the project ("4.0.2") cannot be automatically configured.`

仓库根目录的 `wrangler.jsonc` 只声明「把已经构建好的 `dist/` 当作静态资源上传」，并且打开了 SPA 回退。有这份配置之后，Wrangler 不再改 `vite.config.ts`，也不要求升级 Vite。

在 Cloudflare 控制台自己创建或继续使用这个 Worker，并连接 Git 仓库。本仓库不会替你打开或修改 Cloudflare / GitHub Pages 设置。

| 设置 | 填写 |
| --- | --- |
| 项目类型 | Worker（Workers Builds） |
| 框架 | 界面如果显示 Vite，保持即可。不要为了部署去升级 Vite |
| 构建命令 | `npm run build` |
| 部署命令 | `npx wrangler deploy`（这是默认值，保留） |
| 预览命令 | `npx wrangler preview`（非生产分支的默认值，保留） |
| 构建输出目录 | `dist`（如果界面有这一项） |
| 根目录（Root directory） | `/`（仓库根目录） |
| Node.js | `22`。已提供 `.node-version`。构建镜像如果没用到它，在环境变量里加 `NODE_VERSION` = `22` |
| 环境变量 | 应用本身不需要。Workers Builds 会自己注入部署用的 API token |

`wrangler.jsonc` 里的 `name` 必须和 Worker 名称一致。之前失败日志里的名称是 `myvtuberlite`。如果控制台里的名字不同，只改这个字段。

部署命令留空并不会改成「只上传 dist、不跑 Wrangler」。Workers Builds 在部署命令为空时仍使用默认的 `npx wrangler deploy`。这次要让这条默认命令能过，靠的是仓库里的 `wrangler.jsonc`。

依赖安装使用 `package-lock.json`（构建环境会执行 `npm ci`）。`.npmrc` 打开了 `legacy-peer-deps`，否则 `@pixiv/three-vrm@1.0.6` 和 `three@0.147` 的 peer 冲突会让 `npm ci` 失败。

本地可以先确认部署命令已经越过 Vite 自动配置（不需要 Cloudflare 账号）：

```bash
npm ci
npm run build
npx wrangler@4.160.1 deploy --dry-run
```

`--dry-run` 成功时会读取 `dist` 里的文件然后退出。真正发布到线上仍要在控制台重新跑一次构建，由 Workers Builds 带上它自己的 API token 执行 `npx wrangler deploy`。

### 路由

应用使用 Vue Router 的 history 模式，目前只有 `/`（工作室）。

`wrangler.jsonc` 里的 `assets.not_found_handling` 设为 `single-page-application`：只有请求的路径在 `dist` 里找不到文件时，才返回 `index.html`。已经存在的 JS、CSS、VRM、wasm、tflite 仍按原文件返回。

不要在项目里加顶层 `404.html`，也不要加这种 `_redirects`：

```txt
/* /index.html 200
```

这种规则会把已经存在的静态文件也改成首页。

## 部署之后怎么用

1. 用浏览器打开 Pages 给的 HTTPS 地址。摄像头只能在 HTTPS（或 localhost）下使用。
2. 允许摄像头权限。不需要麦克风。
3. 默认加载内置的 Miku2。右侧可以切换 Miku / Miku2、纯色或默认背景、face / half / full 取景，以及摄像头预览的位置和开关。
4. 建议用桌面版 Chrome 或 Edge。模型大约 15MB，第一次打开要等它下完。

## 限制

- 登录、用户自己的模型库、背景库和上传，都依赖仓库外的后端。开发时代理会把 `/api` 原样转到 `http://127.0.0.1:5000`（`vite.config.ts` 里的 `rewrite` 正则是 `/^\api/`，匹配不到以 `/api` 开头的路径，所以前缀不会被删掉）。静态站点上没有这个后端。没有 token，或接口请求失败时，工作室继续用内置模型和背景。
- 路由里的登录页、首页、模型分享和背景分享在这次修改之前就是注释掉的，静态部署同样不会打开它们。
- MediaPipe 的 `pose_landmark_heavy.tflite` 大约 27MB，超过 Cloudflare 单文件 25 MiB 的上限，构建时会跳过。工作室用的是 `modelComplexity: 1`（`pose_landmark_full.tflite`），不需要这个 heavy 文件。
- 内置模型只包括 `source/humanModel/Miku2.vrm` 和 `source/humanModel/Miku.vrm`。已登录并且后端可用时，侧边栏仍会改用接口返回的列表，模型地址为 `/api/file/download/<id>/0`。
