/// <reference types="vite-plugin-pwa/client" />

import { Workbox } from 'workbox-window'

if ('serviceWorker' in navigator) {
	const wb = new Workbox('/sw.js')

	wb.addEventListener('activated', event => {
		if (!event.isUpdate) {
			console.log('Service worker activated')
		}
	})

	wb.register()
		.then(() => console.log('Service worker registered'))
		.catch(err => console.error('Service worker registration failed:', err))
}
