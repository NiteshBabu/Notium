import type { ReactNode } from 'react'

export const Skeleton = ({
	children,
	isLoading,
	className,
}: {
	children: ReactNode
	isLoading: boolean
	className?: string
}) => {
	if (!isLoading) return children

	return (
		<div className={`bg-slate-100 animate-pulse ${className}`}>
			<div className='opacity-0 pointer-events-none'>{children}</div>
		</div>
	)
}
