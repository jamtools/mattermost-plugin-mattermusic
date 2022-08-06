import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

/** @type {import('vite').UserConfig} */
export default defineConfig({
  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src')
    },

  },
  plugins: [react()]
})
