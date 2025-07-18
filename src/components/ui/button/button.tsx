import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import styles from './button.module.scss'

const buttonVariants = cva(styles.button, {
	variants: {
		variant: {
			default: styles.button_default,
			ghost: styles.button_ghost,
		},
		size: {
			default: styles.button_size_default,
			lg: styles.button_size_lg,
			icon: styles.button_size_icon,
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
})

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			data-slot='button'
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
