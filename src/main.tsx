import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Converter } from './Converter.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Converter />
	</StrictMode>,
)
