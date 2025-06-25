import { ConverterField } from '@/components/converter-field/converter-field'
import { Button } from '@/components/ui/button/button'
import { COINS } from '@/constants/coins'
import { ConversionPair, converterStore } from '@/stores/converter'
import { RiCloseFill } from '@remixicon/react'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import styles from './pair-item.module.scss'

export const PairItem = observer(({ pair }: { pair: ConversionPair }) => {
	const handleRemove = useCallback(() => {
		converterStore.removePair(pair.id)
	}, [pair.id])

	const handleAmountFromChange = useCallback(
		(value: number) => converterStore.updatePairAmountFrom(pair.id, value),
		[pair.id],
	)

	const handleFromCurrencyChange = useCallback(
		(currency: string) =>
			converterStore.updatePairFromCurrency(pair.id, currency),
		[pair.id],
	)

	const handleAmountToChange = useCallback(
		(value: number) => converterStore.updatePairAmountTo(pair.id, value),
		[pair.id],
	)

	const handleToCurrencyChange = useCallback(
		(currency: string) =>
			converterStore.updatePairToCurrency(pair.id, currency),
		[pair.id],
	)

	const handleSwap = useCallback(() => {
		const tempCurrency = pair.fromCurrency
		converterStore.updatePairFromCurrency(pair.id, pair.toCurrency)
		converterStore.updatePairToCurrency(pair.id, tempCurrency)

		const tempAmount = pair.amountFrom
		converterStore.updatePairAmountFrom(pair.id, pair.amountTo)
		converterStore.updatePairAmountTo(pair.id, tempAmount)
	}, [pair])

	const exchangeRate = useMemo(() => {
		if (converterStore.loading) return null
		const { fromCurrency, toCurrency } = pair
		if (fromCurrency === toCurrency) return 1

		const fromRate =
			fromCurrency === 'RUB' ? 1 : converterStore.rates[fromCurrency]
		const toRate =
			toCurrency === 'RUB' ? 1 : converterStore.rates[toCurrency]
		return (fromRate / toRate).toFixed(4)
	}, [
		pair.fromCurrency,
		pair.toCurrency,
		converterStore.rates,
		converterStore.loading,
	])

	return (
		<div key={pair.id} className={styles.container}>
			<div className={styles.pairContainer}>
				<Button
					className={styles.removeButton}
					variant='ghost'
					size='icon'
					onClick={handleRemove}
				>
					<RiCloseFill />
				</Button>
				<ConverterField
					value={pair.amountFrom}
					currency={pair.fromCurrency}
					coins={COINS}
					onValueChange={handleAmountFromChange}
					onCurrencyChange={handleFromCurrencyChange}
				/>
				<ConverterField
					isLast
					value={pair.amountTo}
					currency={pair.toCurrency}
					coins={COINS}
					onValueChange={handleAmountToChange}
					onCurrencyChange={handleToCurrencyChange}
					onSwap={handleSwap}
				/>
			</div>
			<div className={styles.exchangeRate}>
				{converterStore.loading ? (
					<div className={styles.loaderPlaceholder} />
				) : (
					<>
						<span>1 {pair.fromCurrency}</span>
						<span>=</span>
						<span>
							{exchangeRate} {pair.toCurrency}
						</span>
					</>
				)}
			</div>
		</div>
	)
})
