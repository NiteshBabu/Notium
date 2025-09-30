import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '../pages/Login'
import { NotFound } from '../pages/NotFound'
import { Notes } from '../pages/Notes'

export const AppRouter: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<Login />} />
        {/* to do */}
				<Route path='/notes' element={<Notes />} />
				<Route path='/' element={<Navigate to="/notes" />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}
