import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'

export const Navbar = () => {
	const { logout, isAuthenticated } = useAuth()
	const navigate = useNavigate()

	const handleLogout = (): void => {
		logout()
		navigate('/login')
	}

	if (!isAuthenticated) {
		return null
	}

	return (
		<nav className='bg-white shadow-md border-b border-gray-200'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex items-center'>
						<Link to='/notes' className='text-2xl font-bold text-blue-600'>
							Notium
						</Link>
					</div>
					<div className='flex items-center'>
						<button
							onClick={handleLogout}
							className='px-4 py-2 text-sm font-medium text-white hover:bg-red-600 rounded-md transition-colors border bg-red-500 cursor-pointer focus:outline-none focus:ring focus:ring-red-500 focus:ring-offset-2 '>
							Logout
						</button>
					</div>
				</div>
			</div>
		</nav>
	)
}
