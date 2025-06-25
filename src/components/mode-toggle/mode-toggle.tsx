import { Button } from '@/components/ui/button/button'
import { useTheme } from '@/hooks/theme-provider'
import { Monitor, Moon, Sun } from 'lucide-react'

export function ModeToggle() {
	const { theme, setTheme } = useTheme()

	const themes = ['light', 'dark', 'system'] as const
	type Theme = (typeof themes)[number]

	const toggleTheme = () => {
		const currentIndex = themes.indexOf(theme as Theme)
		const nextIndex = (currentIndex + 1) % themes.length
		setTheme(themes[nextIndex])
	}

	const getThemeIcon = () => {
		switch (theme) {
			case 'light':
				return <Sun />
			case 'dark':
				return <Moon />
			case 'system':
				return <Monitor />
			default:
				return <Sun />
		}
	}

	return (
		<Button variant='ghost' onClick={toggleTheme}>
			{getThemeIcon()}
		</Button>
	)
}
