import { type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '../pages/Login'
import { NotFound } from '../pages/NotFound'
import { Notes } from '../pages/Notes'
import { NoteEditor } from '../pages/NoteEditor'
import { Navbar } from '../components/Navbar'
import { Signup } from '../pages/SignUp'
import { useAuth } from '../hooks/use-auth'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated, isLoading } = useAuth()

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-gray-500'>Loading...</div>
			</div>
		)
	}

	return isAuthenticated ? children : <Navigate to='/login' replace />
}
export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Navbar />

			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/sign-up' element={<Signup />} />
				<>
					<Route
						path='/notes'
						element={
							<ProtectedRoute>
								<Notes />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/notes/:id'
						element={
							<ProtectedRoute>
								<NoteEditor />
							</ProtectedRoute>
						}
					/>
					<Route path='/' element={<Navigate to='/notes' replace />} />
				</>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}
