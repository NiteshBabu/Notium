import React from 'react'
import { useNavigate } from 'react-router-dom'
import { type Note } from '../api/notes'
import { Tag } from './Tag'

interface NoteCardProps {
	note: Note
	onStarToggle?: (noteId: number) => void
}

export const NoteCard = ({ note, onStarToggle }: NoteCardProps) => {
	const navigate = useNavigate()

	const handleClick = (): void => {
		navigate(`/notes/${note.id}`)
	}

	const handleStarClick = (e: React.MouseEvent): void => {
		e.stopPropagation()
		if (onStarToggle) {
			onStarToggle(note.id)
		}
	}

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	return (
		<div
			onClick={handleClick}
			className='bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 grid gap-2'>
			<div className='flex items-start justify-between mb-2'>
				<h3 className='text-xl font-semibold text-gray-900 flex-1 mr-2'>
					{note.title}
				</h3>
				<button
					onClick={handleStarClick}
					className='text-2xl focus:outline-none cursor-grab'
					aria-label={note.starred ? 'Unstar note' : 'Star note'}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						stroke-width='2'
						stroke-linecap='round'
						stroke-linejoin='round'
						className={`${
							note.starred
								? 'fill-amber-400 stroke-amber-500'
								: 'stroke-gray-500 fill-none'
						}`}>
						<path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z' />
					</svg>
				</button>
			</div>
			<p className='text-gray-600 mb-4 line-clamp-3'>{note.content}</p>
			<div className='flex flex-wrap gap-2'>
				{note.tags.map((tag) => (
					<Tag key={tag.id} name={tag.name} />
				))}
			</div>
			<div className='text-sm text-gray-500'>
				Updated {formatDate(note.updated_at)}
			</div>
		</div>
	)
}
