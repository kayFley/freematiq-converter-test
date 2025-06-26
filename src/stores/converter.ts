import { makeAutoObservable, runInAction } from 'mobx'

interface CurrencyRate {
	[key: string]: number
}

export interface ConversionPair {
	id: string
	fromCurrency: string
	toCurrency: string
	amountFrom: number | null
	amountTo: number | null
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
				const arr: any[] = JSON.parse(data)
				this.pairs = arr.map(item => ({
					...item,
					amountFrom:
						item.amountFrom != null && item.amountFrom !== 0
							? item.amountFrom
							: null,
					amountTo:
						item.amountTo != null && item.amountTo !== 0 ? item.amountTo : null,
				}))
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
			const isOnline = navigator.onLine
			let rates: CurrencyRate = { RUB: 1 }

			const cachedRates = localStorage.getItem('currencyRates')

			if (isOnline) {
				try {
					const response = await fetch(
						'https://www.cbr-xml-daily.ru/daily_json.js',
					)
					const data = await response.json()

					Object.values(data.Valute).forEach((valute: any) => {
						rates[valute.CharCode] = valute.Value / valute.Nominal
					})

					localStorage.setItem('currencyRates', JSON.stringify(rates))
					this.error = null
				} catch (e) {
					console.error('Online fetch failed, using cache', e)
					if (cachedRates) {
						rates = JSON.parse(cachedRates)
						this.error = 'Using cached rates (online fetch failed)'
					} else {
						throw e
					}
				}
			} else if (cachedRates) {
				rates = JSON.parse(cachedRates)
				this.error = 'Using cached rates (offline mode)'
			} else {
				this.error = 'No internet connection and no cached rates'
				return
			}

			runInAction(() => {
				this.rates = rates
				this.pairs.forEach(pair => this.recalcPair(pair))
				this.rateCache.clear()
			})
		} catch (e) {
			runInAction(() => {
				this.error = 'Failed to load rates'
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
			amountFrom: null,
			amountTo: null,
		}
		this.pairs.push(newPair)
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

	updatePairAmountFrom(id: string, amount: number | null) {
		const pair = this.findPair(id)
		if (pair) {
			pair.amountFrom = amount
			if (amount == null) {
				pair.amountTo = null
			} else {
				this.convertForward(pair)
			}
			this.savePairs()
		}
	}

	updatePairAmountTo(id: string, amount: number | null) {
		const pair = this.findPair(id)
		if (pair) {
			pair.amountTo = amount
			if (amount == null) {
				pair.amountFrom = null
			} else {
				this.convertBackward(pair)
			}
			this.savePairs()
		}
	}

	swapPair(id: string) {
		const pair = this.findPair(id)
		if (!pair) return

		const tempCurrency = pair.fromCurrency
		pair.fromCurrency = pair.toCurrency
		pair.toCurrency = tempCurrency

		const tempAmount = pair.amountFrom
		pair.amountFrom = pair.amountTo
		pair.amountTo = tempAmount

		this.savePairs()
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
		if (pair.amountFrom == null) {
			pair.amountTo = null
		} else {
			pair.amountTo = Number((pair.amountFrom * rate).toFixed(2))
		}
	}

	private convertBackward(pair: ConversionPair) {
		const rate = this.getRate(pair)
		if (!rate) return
		if (pair.amountTo == null) {
			pair.amountFrom = null
		} else {
			pair.amountFrom = Number((pair.amountTo / rate).toFixed(2))
		}
	}

	recalcPair(pair: ConversionPair) {
		if (pair.amountFrom != null) {
			this.convertForward(pair)
		} else if (pair.amountTo != null) {
			this.convertBackward(pair)
		}
	}
}

export const converterStore = new ConverterStore()
