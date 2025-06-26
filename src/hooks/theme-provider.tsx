import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
	children: React.ReactNode
	defaultTheme?: Theme
	storageKey?: string
	lightColor?: string
	darkColor?: string
}

type ThemeProviderState = {
	theme: Theme
	systemTheme: 'dark' | 'light'
	setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
	theme: 'system',
	systemTheme: 'light',
	setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
	children,
	defaultTheme = 'system',
	storageKey = 'vite-ui-theme',
	lightColor = '#ffffff',
	darkColor = '#121215',
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
	)
	const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(
		window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light',
	)

	const updateThemeColor = (theme: 'dark' | 'light') => {
		const color = theme === 'dark' ? darkColor : lightColor
		const metaThemeColor = document.querySelector('meta[name="theme-color"]')
		if (metaThemeColor) {
			metaThemeColor.setAttribute('content', color)
		} else {
			const meta = document.createElement('meta')
			meta.name = 'theme-color'
			meta.content = color
			document.head.appendChild(meta)
		}
	}

	useEffect(() => {
		const root = window.document.documentElement
		root.classList.remove('light', 'dark')

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
				.matches
				? 'dark'
				: 'light'
			root.classList.add(systemTheme)
			updateThemeColor(systemTheme)
			setSystemTheme(systemTheme)
		} else {
			root.classList.add(theme)
			updateThemeColor(theme)
		}

		// Слушатель изменений системной темы
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handler = (e: MediaQueryListEvent) => {
			const newSystemTheme = e.matches ? 'dark' : 'light'
			setSystemTheme(newSystemTheme)
			if (theme === 'system') {
				root.classList.remove('light', 'dark')
				root.classList.add(newSystemTheme)
				updateThemeColor(newSystemTheme)
			}
		}
		mediaQuery.addEventListener('change', handler)

		return () => mediaQuery.removeEventListener('change', handler)
	}, [theme, darkColor, lightColor])

	const value = {
		theme,
		systemTheme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme)
			setTheme(theme)
		},
	}

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext)
	if (context === undefined)
		throw new Error('useTheme must be used within a ThemeProvider')
	return context
}
