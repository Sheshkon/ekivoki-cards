import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {VitePWA} from 'vite-plugin-pwa'
import {visualizer} from "rollup-plugin-visualizer";
import manifest from "./manifest.json"

export default defineConfig({
    base: '/ekivoki-cards/',
    plugins: [
        vue(),
        visualizer({filename: 'stats.html', template: 'treemap'}),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: manifest,
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
                maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
                runtimeCaching: [
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images',
                            expiration: {
                                maxEntries: 64,
                                maxAgeSeconds: 7 * 24 * 60 * 60 // 1 week
                            }
                        }
                    },
                    {
                        urlPattern: /\.(?:mp3|wav|ogg)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'audio',
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                            }
                        }
                    }
                ]
            }

        })
    ]
})