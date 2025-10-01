import React, { useState, useEffect } from 'react'
import type { Note, NoteIn } from '../api/notes'

interface NoteFormProps {
	note?: Note
	onSubmit: (data: NoteIn) => Promise<void>
	onDelete?: () => Promise<void>
	isLoading?: boolean
}

export const NoteForm = ({
	note,
	onSubmit,
	onDelete,
	isLoading = false,
}: NoteFormProps) => {
	const [title, setTitle] = useState<string>('')
	const [content, setContent] = useState<string>('')
	const [tags, setTags] = useState<string>('')

	useEffect(() => {
		if (note) {
			setTitle(note.title)
			setContent(note.content)
			setTags(note.tags.map((tag) => tag.name).join(', '))
		}
	}, [note])

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault()
		const tagList = tags
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0)

		await onSubmit({
			title,
			content,
			tags: tagList,
		})
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div>
				<label
					htmlFor='title'
					className='block text-sm font-medium text-gray-700 mb-2'>
					Title
				</label>
				<input
					type='text'
					id='title'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
					className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
					placeholder='Enter note title'
				/>
			</div>

			<div>
				<label
					htmlFor='content'
					className='block text-sm font-medium text-gray-700 mb-2'>
					Content
				</label>
				<textarea
					id='content'
					value={content}
					onChange={(e) => setContent(e.target.value)}
					required
					rows={12}
					className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
					placeholder='Enter note content'
				/>
			</div>

			<div>
				<label
					htmlFor='tags'
					className='block text-sm font-medium text-gray-700 mb-2'>
					Tags (comma-separated)
				</label>
				<input
					type='text'
					id='tags'
					value={tags}
					onChange={(e) => setTags(e.target.value)}
					className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
					placeholder='work, personal, important'
				/>
			</div>

			<div className='flex gap-4'>
				<button
					type='submit'
					disabled={isLoading}
					className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'>
					{isLoading ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
				</button>
				{note && onDelete && (
					<button
						type='button'
						onClick={onDelete}
						disabled={isLoading}
						className='px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'>
						Delete
					</button>
				)}
			</div>
		</form>
	)
}
