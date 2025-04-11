import { PairItem } from '@/components/pair-item'
import { Button } from '@/components/ui/button'
import { ConversionPair, converterStore } from '@/stores/converter'
import { PlusIcon } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback } from 'react'

export const Converter = observer(() => {
	const handleAddPair = useCallback(() => converterStore.addPair(), [])

	return (
		<div className='dark bg-background dark:bg-secondary/64 min-h-screen'>
			<div className='dark bg-background dark:bg-secondary/64 mx-auto h-auto max-w-4xl rounded-b-sm p-2'>
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

				<Button
					size='lg'
					className='w-full opacity-80 hover:opacity-100'
					onClick={handleAddPair}
				>
					<PlusIcon />
					Добавить пару валют
				</Button>
			</div>
		</div>
	)
})
