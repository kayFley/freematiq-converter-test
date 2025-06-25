import { PairItem } from '@/components/pair-item/pair-item'
import { Button } from '@/components/ui/button/button'
import styles from '@/converter.module.scss'
import { ThemeProvider } from '@/hooks/theme-provider'
import { ConversionPair, converterStore } from '@/stores/converter'
import { PlusIcon } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback } from 'react'
import { ModeToggle } from './components/mode-toggle/mode-toggle'

export const Converter = observer(() => {
	const handleAddPair = useCallback(() => converterStore.addPair(), [])

	return (
		<ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
			<ModeToggle />
			<div className={`${styles.container}`}>
				<AnimatePresence>
					{converterStore.pairs.map((pair: ConversionPair) => (
						<motion.div
							key={pair.id}
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
							layout
						>
							<PairItem key={pair.id} pair={pair} />
						</motion.div>
					))}
				</AnimatePresence>

				<Button size='lg' className={styles.addButton} onClick={handleAddPair}>
					<PlusIcon />
					Добавить пару валют
				</Button>
			</div>
		</ThemeProvider>
	)
})
