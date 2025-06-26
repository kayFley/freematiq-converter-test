import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
			manifest: {
				name: 'Currency Converter',
				short_name: 'Converter',
				description: 'Offline Currency Converter App',
				theme_color: '#ffffff',
				icons: [
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/www\.cbr-xml-daily\.ru\/.*/i,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'currency-rates-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 24 * 60 * 60,
							},
						},
					},
				],
			},
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: 'index.html',
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	base: '/',
})
