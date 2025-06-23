import { CoinItems } from '@/components/coin-items/coin-items'
import { Card } from '@/components/ui/card/card'
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select/select'
import { COINS } from '@/constants/coins'
import { cn } from '@/lib/utils'
import { RiArrowLeftRightLine, RiArrowUpDownLine } from '@remixicon/react'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { I18nProvider, Input, Label, NumberField } from 'react-aria-components'
import styles from './converter-field.module.css'

export const ConverterField = observer(
	({
		className,
		isLast,
		value,
		currency,
		coins,
		onValueChange,
		onCurrencyChange,
		onSwap,
	}: {
		className?: string
		isLast?: boolean
		value: number
		currency: string
		coins: typeof COINS
		onValueChange: (value: number) => void
		onCurrencyChange: (currency: string) => void
		onSwap?: () => void
	}) => {
		const handleValueChange = useCallback(
			(value: number) => onValueChange(value),
			[onValueChange],
		)

		const handleCurrencyChange = useCallback(
			(currency: string) => onCurrencyChange(currency),
			[onCurrencyChange],
		)

		const valueStr = value.toString().replace(/,/g, '')
		const valueLength = valueStr.length

		const getTextSizeClass = () => {
			if (valueLength <= 12) return styles.inputSizeXXLarge
			if (valueLength <= 16) return styles.inputSizeXLarge
			if (valueLength <= 18) return styles.inputSizeLarge
			if (valueLength <= 20) return styles.inputSizeMedium
			return styles.inputSizeSmall
		}

		return (
			<>
				{isLast && (
					<div
						className={cn(styles.swapIcon, styles.swapIconLeft)}
						onClick={onSwap}
						aria-hidden='true'
						role='button'
						tabIndex={0}
					>
						<RiArrowLeftRightLine
							className={cn(
								'text-primary-foreground',
								styles.arrowHorizontal,
							)}
							size={20}
						/>
						<RiArrowUpDownLine
							className={cn(
								'text-primary-foreground',
								styles.arrowVertical,
							)}
							size={20}
						/>
					</div>
				)}
				<Card
					className={cn(
						styles.card,
						isLast ? styles.cardLast : styles.cardFirst,
						className,
					)}
				>
					{isLast && (
						<div
							className={styles.topBorder}
							aria-hidden='true'
						></div>
					)}
					<div className={styles.inputWrapper}>
						<I18nProvider locale='ru-RU'>
							<NumberField
								value={value}
								onChange={handleValueChange}
								minValue={0}
								formatOptions={{
									minimumFractionDigits: 1,
									maximumFractionDigits: 2,
									useGrouping: true,
								}}
							>
								<Label className='sr-only'>Сумма</Label>
								<Input
									className={cn(
										styles.input,
										getTextSizeClass(),
									)}
									placeholder='0.0'
								/>
							</NumberField>
						</I18nProvider>
					</div>
					<div>
						<Select
							value={currency}
							onValueChange={handleCurrencyChange}
						>
							<SelectTrigger
								className={styles.selectTriggerCustom}
							>
								<SelectValue placeholder='Select coin' />
							</SelectTrigger>
							<SelectContent
								className='dark [&_*[role=option]>span>svg]:text-muted-foreground/80 border-none inset-shadow-[0_1px_rgb(255_255_255/0.15)] shadow-black/10 dark:bg-zinc-800 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0'
								align='center'
							>
								<div className={styles.searchHint}>
									для поиска начните ввод
								</div>
								<div className={styles.coinGrid}>
									<CoinItems coins={coins} />
								</div>
							</SelectContent>
						</Select>
					</div>
				</Card>
			</>
		)
	},
)
