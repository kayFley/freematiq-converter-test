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
import { XIcon } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import { I18nProvider, Input, Label, TextField } from 'react-aria-components'
import { Button } from '../ui/button/button'
import styles from './converter-field.module.scss'

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
		value: number | null
		currency: string
		coins: typeof COINS
		onValueChange: (value: number | null) => void
		onCurrencyChange: (currency: string) => void
		onSwap?: () => void
		onClear?: () => void
	}) => {
		const [inputText, setInputText] = useState<string>(
			value != null ? String(value) : '',
		)

		useEffect(() => {
			const newText = value != null ? String(value) : ''
			if (newText !== inputText) {
				setInputText(newText)
			}
		}, [value])

		const handleInput = useCallback(
			(e: React.FormEvent<HTMLInputElement>) => {
				const raw = e.currentTarget.value
				setInputText(raw)
				const normalized = raw.replace(',', '.')
				const parsed = parseFloat(normalized)
				if (normalized === '' || isNaN(parsed)) {
					onValueChange(null)
				} else {
					onValueChange(parsed)
				}
			},
			[onValueChange],
		)

		const handleBlur = useCallback(() => {
			if (inputText) {
				const normalized = inputText.replace(',', '.')
				const parsed = parseFloat(normalized)
				if (!isNaN(parsed)) {
					const final = String(parsed)
					if (final !== inputText) {
						setInputText(final)
					}
				} else {
					setInputText('')
				}
			}
		}, [inputText])

		const handleClear = useCallback(() => {
			setInputText('')
			onValueChange(null)
		}, [onValueChange])

		const handleCurrencyChange = useCallback(
			(cur: string) => {
				onCurrencyChange(cur)
			},
			[onCurrencyChange],
		)

		const valueStr = inputText.replace(/,/g, '')
		const valueLength = valueStr.length
		const getTextSizeClass = () => {
			if (valueLength === 0) return styles.inputSizeXXLarge
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
							className={cn('text-primary-foreground', styles.arrowHorizontal)}
							size={20}
						/>
						<RiArrowUpDownLine
							className={cn('text-primary-foreground', styles.arrowVertical)}
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
						<div className={styles.topBorder} aria-hidden='true'></div>
					)}
					<div className={styles.inputWrapper}>
						<I18nProvider locale='ru-RU'>
							<TextField
								value={inputText}
								onChange={(val: string) => {
									setInputText(val)
									const normalized = val.replace(',', '.')
									const parsed = parseFloat(normalized)
									if (normalized === '' || isNaN(parsed)) {
										onValueChange(null)
									} else {
										onValueChange(parsed)
									}
								}}
								onBlur={handleBlur}
							>
								<Label className='sr-only'>Сумма</Label>
								<Input
									className={cn(styles.input, getTextSizeClass())}
									maxLength={20}
									placeholder='0.0'
									onInput={handleInput}
									onBlur={handleBlur}
									inputMode='decimal'
									pattern='[0-9]*[.,]?[0-9]*'
								/>
							</TextField>
						</I18nProvider>
						{inputText !== '' && (
							<Button
								type='button'
								size='icon'
								variant='ghost'
								onClick={handleClear}
							>
								<XIcon />
							</Button>
						)}
					</div>
					<div>
						<Select value={currency} onValueChange={handleCurrencyChange}>
							<SelectTrigger className={styles.selectTriggerCustom}>
								<SelectValue placeholder='Select coin' />
							</SelectTrigger>
							<SelectContent className={styles.selectContent} align='center'>
								<div className={styles.searchHint}>для поиска начните ввод</div>
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
