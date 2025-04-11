import { ConverterField } from '@/components/converter-field'
import { Button } from '@/components/ui/button'
import { COINS } from '@/constants/coins'
import { ConversionPair, converterStore } from '@/stores/converter'
import { RiCloseFill } from '@remixicon/react'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'

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
		<div key={pair.id}>
			<div className='relative flex flex-col items-center gap-1 sm:flex-row'>
				<Button
					className='absolute top-1 right-1 z-10'
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
				/>
			</div>
			<div className='text-muted-foreground my-1 grid grid-cols-[1fr_auto_1fr] items-center gap-1 text-center text-xs'>
				{converterStore.loading ? (
					<div className='bg-background/0 h-4 w-full' />
				) : (
					<>
						<span className='text-right uppercase'>
							1 {pair.fromCurrency}
						</span>
						<span className='text-muted-foreground'>=</span>
						<span className='text-left uppercase'>
							{exchangeRate} {pair.toCurrency}
						</span>
					</>
				)}
			</div>
		</div>
	)
})
