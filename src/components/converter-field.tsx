import { CoinItems } from '@/components/coin-items'
import { Card } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { COINS } from '@/constants/coins'
import { cn } from '@/lib/utils'
import { RiArrowLeftRightLine, RiArrowUpDownLine } from '@remixicon/react'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { I18nProvider, Input, Label, NumberField } from 'react-aria-components'

export const ConverterField = observer(
	({
		className,
		isLast,
		value,
		currency,
		coins,
		onValueChange,
		onCurrencyChange,
	}: {
		className?: string
		isLast?: boolean
		value: number
		currency: string
		coins: typeof COINS
		onValueChange: (value: number) => void
		onCurrencyChange: (currency: string) => void
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
			if (valueLength <= 12) return 'text-xl'
			if (valueLength <= 16) return 'text-lg'
			if (valueLength <= 18) return 'text-base'
			if (valueLength <= 20) return 'text-sm'
			return 'text-xs'
		}

		return (
			<>
				{isLast && (
					<div
						className='from-primary to-primary-to absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-linear-to-b inset-shadow-[0_1px_rgb(255_255_255/0.15)] sm:left-1/2 sm:-translate-x-1/2'
						aria-hidden='true'
					>
						<RiArrowLeftRightLine
							className='text-primary-foreground hidden sm:block'
							size={20}
						/>
						<RiArrowUpDownLine
							className='text-primary-foreground sm:hidden'
							size={20}
						/>
					</div>
				)}
				<Card
					className={cn(
						'dark:bg-card/64 relative w-full flex-row items-center justify-between gap-2 p-5',
						isLast
							? '[mask-image:radial-gradient(ellipse_26px_24px_at_50%_0%,transparent_0,_transparent_24px,_black_25px)] sm:[mask-image:radial-gradient(ellipse_24px_26px_at_0%_50%,transparent_0,_transparent_22px,_black_23px)] sm:pl-8'
							: '[mask-image:radial-gradient(ellipse_26px_24px_at_50%_100%,transparent_0,_transparent_24px,_black_25px)] sm:[mask-image:radial-gradient(ellipse_24px_26px_at_100%_50%,transparent_0,_transparent_22px,_black_23px)] sm:pr-8',
						className,
					)}
				>
					{isLast && (
						<div
							className='absolute -top-px left-1/2 h-[25px] w-[50px] -translate-x-1/2 rounded-b-full border-x border-b border-white/15 sm:border-transparent'
							aria-hidden='true'
						></div>
					)}
					<div className='grow'>
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
									className={`focus:bg-card/64 mb-0.5 -ml-1 w-full max-w-48 appearance-none rounded-lg bg-transparent px-1 font-semibold focus-visible:outline-none ${getTextSizeClass()}`}
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
							<SelectTrigger className='[&>span_svg]:text-muted-foreground/80 bg-card/64 hover:bg-card/80 h-8 rounded-full border-0 p-2 shadow-lg inset-shadow-[0_1px_rgb(255_255_255/0.15)] [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0'>
								<SelectValue placeholder='Select coin' />
							</SelectTrigger>
							<SelectContent
								className='dark [&_*[role=option]>span>svg]:text-muted-foreground/80 border-none inset-shadow-[0_1px_rgb(255_255_255/0.15)] shadow-black/10 dark:bg-zinc-800 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0'
								align='center'
							>
								<div className='text-muted-foreground hidden text-center text-xs sm:block'>
									для поиска начните ввод
								</div>
								<div className='grid grid-cols-3 gap-1 p-1'>
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
