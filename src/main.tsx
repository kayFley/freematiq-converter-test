import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Converter } from './Converter.tsx'
import './index.css'
import './service-worker'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Converter />
	</StrictMode>,
)
