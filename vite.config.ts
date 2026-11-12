import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import fs from 'node:fs'
import path from 'node:path'
import type { Connect, Plugin } from 'vite'

// Cloudflare Pages rejects a single asset at or above 25 MiB.
// pose_landmark_heavy.tflite is ~27 MiB and is only fetched when
// MediaPipe modelComplexity is 2. The studio uses complexity 1.
const PAGES_MAX_FILE_BYTES = 25 * 1024 * 1024

const MIME: Record<string, string> = {
  '.wasm': 'application/wasm',
  '.js': 'text/javascript; charset=utf-8',
  '.data': 'application/octet-stream',
  '.binarypb': 'application/octet-stream',
  '.tflite': 'application/octet-stream',
  '.vrm': 'model/gltf-binary',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

function resolveInside(root: string, rel: string): string | null {
  const file = path.resolve(root, rel)
  if (file !== root && !file.startsWith(root + path.sep)) return null
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null
  return file
}

function runtimeAssetsPlugin(): Plugin {
  const sourceRoot = path.resolve('source')
  const mediapipePackages = ['holistic', 'camera_utils', 'drawing_utils']
  let base = '/'

  function mediapipePackageRoot(pkg: string): string {
    return path.resolve('node_modules/@mediapipe', pkg)
  }

  function fileForUrl(urlPath: string): string | null {
    if (urlPath.startsWith('/source/')) {
      return resolveInside(sourceRoot, decodeURIComponent(urlPath.slice('/source/'.length)))
    }
    const mediapipe = urlPath.match(/^\/mediapipe\/([^/]+)\/(.+)$/)
    if (mediapipe && mediapipePackages.includes(mediapipe[1])) {
      return resolveInside(mediapipePackageRoot(mediapipe[1]), decodeURIComponent(mediapipe[2]))
    }
    return null
  }

  const serveRuntimeAssets: Connect.NextHandleFunction = (req, res, next) => {
    const urlPath = (req.url || '').split('?')[0]
    const file = fileForUrl(urlPath)
    if (!file) return next()
    const ext = path.extname(file).toLowerCase()
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
    fs.createReadStream(file).pipe(res)
  }

  function copyTree(src: string, dest: string) {
    fs.mkdirSync(dest, { recursive: true })
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const from = path.join(src, entry.name)
      const to = path.join(dest, entry.name)
      if (entry.isDirectory()) {
        copyTree(from, to)
        continue
      }
      if (!entry.isFile()) continue
      const size = fs.statSync(from).size
      if (size >= PAGES_MAX_FILE_BYTES) {
        console.warn(
          `[runtime-assets] skip ${entry.name} (${(size / 1024 / 1024).toFixed(1)} MiB): over the Cloudflare Pages 25 MiB file limit`
        )
        continue
      }
      fs.copyFileSync(from, to)
    }
  }

  return {
    name: 'runtime-assets',
    configResolved(config) {
      base = config.base || '/'
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const prefix = base.endsWith('/') ? base : `${base}/`
        const tags = ['camera_utils/camera_utils.js', 'drawing_utils/drawing_utils.js', 'holistic/holistic.js']
          .map((file) => `<script src="${prefix}mediapipe/${file}"></script>`)
          .join('\n  ')
        return html.replace('</head>', `  ${tags}\n</head>`)
      },
    },
    configureServer(server) {
      server.middlewares.use(serveRuntimeAssets)
    },
    writeBundle(options) {
      const outDir = options.dir ? path.resolve(options.dir) : path.resolve('dist')
      copyTree(sourceRoot, path.join(outDir, 'source'))
      for (const pkg of mediapipePackages) {
        copyTree(mediapipePackageRoot(pkg), path.join(outDir, 'mediapipe', pkg))
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    runtimeAssetsPlugin(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    open: true,//自动打开浏览器
    proxy: {
      '/api': {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        rewrite(path) {
          return path.replace(/^\api/, '')
        }
      }
    }
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1500,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              ?.split('/')[0]
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.toString().split('/')
            : [];
          const fileName =
            facadeModuleId[facadeModuleId.length - 2] || '[name]';
          return `js/${fileName}/[name].[hash].js`;
        }
      }
    }
  }
})
