import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notesApi, type Note } from '../api/notes'
import { NoteCard } from '../components/NoteCard'
import { Skeleton } from '../components/Skeleton'

export const Notes = () => {
	const [search, setSearch] = useState<string>('')
	const [selectedTag, setSelectedTag] = useState<string>('')
	const [starredFilter, setStarredFilter] = useState<boolean | undefined>(
		undefined
	)
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const { data: notes = [], isFetching } = useQuery<Note[]>({
		queryKey: ['notes', search, selectedTag, starredFilter],
		queryFn: () =>
			notesApi.list({
				search: search || undefined,
				tag: selectedTag || undefined,
				starred: starredFilter,
			}),
	})

	const { data: allNotes = [] } = useQuery<Note[]>({
		queryKey: ['notes'],
		queryFn: () => notesApi.list(),
	})
	// Extract unique tags from all notes
	const allTags = Array.from(
		new Set(allNotes.flatMap((note) => note.tags.map((tag) => tag.name)))
	).sort()

	const toggleStarMutation = useMutation({
		mutationFn: (noteId: number) => notesApi.toggleStar(noteId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] })
		},
	})

	const handleStarToggle = (noteId: number): void => {
		toggleStarMutation.mutate(noteId)
	}

	return (
		<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			<div className='mb-8'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-3xl font-bold text-gray-900'>My Notes</h1>
					<button
						onClick={() => navigate('/notes/new')}
						className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
						+ New Note
					</button>
				</div>

				<div className='space-y-4'>
					<div>
						<input
							type='search'
							placeholder='Search notes...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
						/>
					</div>

					<div className='flex gap-4 flex-wrap'>
						<div className='flex-1 min-w-[200px]'>
							<select
								value={selectedTag}
								onChange={(e) => setSelectedTag(e.target.value)}
								className='w-full text-sm px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
								title='Filter by tag'>
								<option value=''>Tags</option>
								{allTags.map((tag) => (
									<option key={tag} value={tag} className='text-sm'>
										{tag}
									</option>
								))}
							</select>
						</div>

						<div>
							<button
								onClick={() =>
									setStarredFilter(starredFilter === true ? undefined : true)
								}
								className={`px-4 py-2 border rounded-md flex gap-2 cursor-pointer ${
									starredFilter === true
										? 'bg-yellow-100 border-yellow-300 text-yellow-800'
										: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
								}`}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									stroke-width='2'
									stroke-linecap='round'
									stroke-linejoin='round'
									className='fill-amber-400 stroke-amber-500'>
									<path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z' />
								</svg>
								Starred
							</button>
						</div>
						{(selectedTag || starredFilter !== undefined || search) && (
							<button
								onClick={() => {
									setSearch('')
									setSelectedTag('')
									setStarredFilter(undefined)
								}}
								className='px-4 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer border rounded-md border-red-500 '>
								Clear Filters
							</button>
						)}
					</div>
				</div>
			</div>

			<Skeleton isLoading={isFetching} className='min-h-[400px]'>
				{notes.length === 0 ? (
					<div className='text-center py-12'>
						<div className='text-gray-500 mb-4'>No notes found.</div>
						<button
							onClick={() => navigate('/notes/new')}
							className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
							Create your first note
						</button>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{notes.map((note) => (
							<NoteCard
								key={note.id}
								note={note}
								onStarToggle={handleStarToggle}
							/>
						))}
					</div>
				)}
			</Skeleton>
		</div>
	)
}
