import type { ReactNode } from 'react'

export const Skeleton = ({
	children,
	isLoading,
}: {
	children: ReactNode
	isLoading: boolean
}) => {
	if (!isLoading) return children

	return (
		<div className='bg-slate-100 animate-pulse'>
			<div className='opacity-0 pointer-events-none'>{children}</div>
		</div>
	)
}
