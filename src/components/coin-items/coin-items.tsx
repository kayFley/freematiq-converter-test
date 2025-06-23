import { SelectItem } from '@/components/ui/select/select'
import { COINS } from '@/constants/coins'
import { memo } from 'react'
import ReactCountryFlag from 'react-country-flag'
import styles from './coin-items.module.css'

export const CoinItems = memo(({ coins }: { coins: typeof COINS }) => (
	<>
		{coins.map(coin => (
			<SelectItem title={coin.title} key={coin.id} value={coin.id}>
				<ReactCountryFlag
					className={styles.flag}
					countryCode={coin.code}
					width={24}
					height={24}
					alt={coin.name}
					svg
				/>
				<span className={styles.coinLabel}>{coin.name}</span>
			</SelectItem>
		))}
	</>
))
