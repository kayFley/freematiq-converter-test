import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='card'
			className={cn(
				'bg-card dark:bg-card/44 text-card-foreground flex flex-col gap-6 rounded-xl py-5 shadow-lg dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)]',
				className,
			)}
			{...props}
		/>
	)
}

export { Card }
