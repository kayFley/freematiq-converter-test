import { SelectItem } from '@/components/ui/select/select'
import { COINS } from '@/constants/coins'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { memo } from 'react'
import ReactCountryFlag from 'react-country-flag'
import styles from './coin-items.module.scss'

export const CoinItems = memo(({ coins }: { coins: typeof COINS }) => {
	const isOnline = useNetworkStatus()

	return (
		<>
			{coins.map(coin => (
				<SelectItem title={coin.title} key={coin.id} value={coin.id}>
					{isOnline && (
						<ReactCountryFlag
							className={styles.flag}
							countryCode={coin.code}
							width={24}
							height={24}
							alt={coin.name}
							svg
						/>
					)}
					<span className={styles.coinLabel}>{coin.name}</span>
				</SelectItem>
			))}
		</>
	)
})
