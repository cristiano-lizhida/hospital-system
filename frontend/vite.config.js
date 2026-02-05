import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configPath = path.resolve(__dirname, '../config.yaml')
let backendPort = 8080 

try {
  const fileContents = fs.readFileSync(configPath, 'utf8')
  const config = yaml.load(fileContents)
  if (config?.server?.port) {
    backendPort = config.server.port
    console.log(`[Vite] 成功从 config.yaml 读取后端端口: ${backendPort}`)
  }
} catch (e) {
  console.error('[Vite] 读取 config.yaml 失败，使用默认端口 8080', e)
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      }
    }
  }
})