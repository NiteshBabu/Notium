interface TagProps {
	name: string
	onClick?: () => void
	className?: string
}

export const Tag = ({ name, onClick, className = '' }: TagProps) => {
	return (
		<span
			onClick={onClick}
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors ${className}`}>
			{name}
		</span>
	)
}
