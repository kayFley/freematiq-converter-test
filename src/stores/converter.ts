import { makeAutoObservable, runInAction } from 'mobx'

interface CurrencyRate {
	[key: string]: number
}

export interface ConversionPair {
	id: string
	fromCurrency: string
	toCurrency: string
	amountFrom: number
	amountTo: number
}

const LOCAL_STORAGE_KEY = 'conversionPairs'
const SAVE_DELAY = 300

export class ConverterStore {
	pairs: ConversionPair[] = []
	rates: CurrencyRate = {}
	loading = false
	error: string | null = null
	private saveTimeout: ReturnType<typeof setTimeout> | null = null
	private rateCache = new Map<string, number>()

	constructor() {
		makeAutoObservable(this)
		this.loadPairs()
		this.fetchRates()
	}

	loadPairs() {
		const data = localStorage.getItem(LOCAL_STORAGE_KEY)
		if (data) {
			try {
				this.pairs = JSON.parse(data)
			} catch (e) {
				this.pairs = []
			}
		}
		if (this.pairs.length === 0) {
			this.addPair(Date.now().toString(), 'USD', 'RUB')
			this.addPair((Date.now() + 1).toString(), 'EUR', 'RUB')
		}
	}

	savePairs() {
		if (this.saveTimeout) {
			clearTimeout(this.saveTimeout)
		}
		this.saveTimeout = setTimeout(() => {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.pairs))
			this.saveTimeout = null
		}, SAVE_DELAY)
	}

	async fetchRates() {
		this.loading = true
		try {
			const response = await fetch(
				'https://www.cbr-xml-daily.ru/daily_json.js',
			)
			const data = await response.json()

			const rates: CurrencyRate = { RUB: 1 }
			Object.values(data.Valute).forEach((valute: any) => {
				rates[valute.CharCode] = valute.Value / valute.Nominal
			})

			runInAction(() => {
				this.rates = rates
				this.pairs.forEach(pair => this.recalcPair(pair))
				this.rateCache.clear()
			})
		} catch (e) {
			runInAction(() => {
				this.error = 'err'
			})
		} finally {
			runInAction(() => {
				this.loading = false
			})
		}
	}

	addPair(idp?: string, fromCurrency?: string, toCurrency?: string) {
		const id = idp || Date.now().toString()
		const newPair: ConversionPair = {
			id,
			fromCurrency: fromCurrency || 'USD',
			toCurrency: toCurrency || 'RUB',
			amountFrom: 0,
			amountTo: 0,
		}
		this.pairs.push(newPair)
		this.recalcPair(newPair)
		this.savePairs()
	}

	removePair(id: string) {
		this.pairs = this.pairs.filter(pair => pair.id !== id)
		this.savePairs()
	}

	updatePairFromCurrency(id: string, currency: string) {
		const pair = this.findPair(id)
		if (pair) {
			pair.fromCurrency = currency
			this.rateCache.clear()
			this.recalcPair(pair)
			this.savePairs()
		}
	}

	updatePairToCurrency(id: string, currency: string) {
		const pair = this.findPair(id)
		if (pair) {
			pair.toCurrency = currency
			this.rateCache.clear()
			this.recalcPair(pair)
			this.savePairs()
		}
	}

	updatePairAmountFrom(id: string, amount: number) {
		const pair = this.findPair(id)
		if (pair) {
			pair.amountFrom = amount
			this.convertForward(pair)
			this.savePairs()
		}
	}

	updatePairAmountTo(id: string, amount: number) {
		const pair = this.findPair(id)
		if (pair) {
			pair.amountTo = amount
			this.convertBackward(pair)
			this.savePairs()
		}
	}

	private findPair(id: string): ConversionPair | undefined {
		return this.pairs.find(pair => pair.id === id)
	}

	private getRate(pair: ConversionPair) {
		const cacheKey = `${pair.fromCurrency}_${pair.toCurrency}`
		if (this.rateCache.has(cacheKey)) {
			return this.rateCache.get(cacheKey)
		}

		const fromRate =
			pair.fromCurrency === 'RUB' ? 1 : this.rates[pair.fromCurrency] || 1
		const toRate =
			pair.toCurrency === 'RUB' ? 1 : this.rates[pair.toCurrency] || 1
		const rate = fromRate / toRate

		this.rateCache.set(cacheKey, rate)
		return rate
	}

	private convertForward(pair: ConversionPair) {
		const rate = this.getRate(pair)
		if (!rate) return

		pair.amountTo = Number((pair.amountFrom * rate).toFixed(2))
	}

	private convertBackward(pair: ConversionPair) {
		const rate = this.getRate(pair)
		if (!rate) return

		pair.amountFrom = Number((pair.amountTo / rate).toFixed(2))
	}

	recalcPair(pair: ConversionPair) {
		this.convertForward(pair)
	}
}

export const converterStore = new ConverterStore()
