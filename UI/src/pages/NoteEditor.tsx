import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notesApi, type NoteIn } from '../api/notes'
import { NoteForm } from '../components/NoteForm'
import { Skeleton } from '../components/Skeleton'

export const NoteEditor = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const isNew = id === 'new'

	const { data: note, isLoading: isLoadingNote } = useQuery({
		queryKey: ['note', id],
		queryFn: () => notesApi.get(Number(id)),
		enabled: !isNew,
	})

	const createMutation = useMutation({
		mutationFn: (data: NoteIn) => notesApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] })
			navigate('/notes')
		},
	})

	const updateMutation = useMutation({
		mutationFn: (data: NoteIn) => notesApi.update(Number(id), data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] })
			queryClient.invalidateQueries({ queryKey: ['note', id] })
			navigate('/notes')
		},
	})

	const deleteMutation = useMutation({
		mutationFn: () => notesApi.delete(Number(id)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] })
			navigate('/notes')
		},
	})

	const handleSubmit = async (data: NoteIn): Promise<void> => {
		if (isNew) {
			await createMutation.mutateAsync(data)
		} else {
			await updateMutation.mutateAsync(data)
		}
	}

	const handleDelete = async (): Promise<void> => {
		if (window.confirm('Are you sure you want to delete this note?')) {
			await deleteMutation.mutateAsync()
		}
	}

	return (
		<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			<Skeleton isLoading={!isNew && isLoadingNote}>
				<div className='mb-6'>
					<button
						onClick={() => navigate('/notes')}
						className='text-blue-600 hover:text-blue-800  mb-4 cursor-pointer border py-2 px-4 rounded-md focus:outline-none focus:ring-2 ring-offset-2'>
						← Back to Notes
					</button>
					<h1 className='text-3xl font-bold text-gray-900'>
						{isNew ? 'Create New Note' : 'Edit Note'}
					</h1>
				</div>

				<div className='rounded-lg shadow-md border-gray-300 border p-6'>
					<NoteForm
						note={note}
						onSubmit={handleSubmit}
						onDelete={isNew ? undefined : handleDelete}
						isLoading={
							createMutation.isPending ||
							updateMutation.isPending ||
							deleteMutation.isPending
						}
					/>
				</div>
			</Skeleton>
		</div>
	)
}
