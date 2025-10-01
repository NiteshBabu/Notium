import React, { useState } from 'react'
import { useAuth } from '../hooks/use-auth'
import { useNavigate } from 'react-router-dom'

export const Signup = () => {
	const [username, setUsername] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const { register } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault()
		setError('')
		setIsLoading(true)

		try {
			if (password !== confirmPassword) throw Error("Passwords Don't Match")
			await register({ username, email, password })
			navigate('/notes')
		} catch (err: any) {
			setError(
				err.response?.data?.detail || err.message || 'Something Went Wrong'
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h1 className='text-center text-4xl font-bold text-blue-600 mb-2'>
						Notium
					</h1>
					<h2 className='text-center text-2xl font-semibold text-gray-900'>
						Sign up for a new account
					</h2>
				</div>
				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					{error && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
							{error}
						</div>
					)}
					<div className='rounded-md shadow-sm -space-y-px'>
						<div>
							<label htmlFor='username' className='sr-only'>
								Email
							</label>
							<input
								id='username'
								name='username'
								type='text'
								required
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm rounded-t-md'
								placeholder='username'
							/>
						</div>
						<div>
							<label htmlFor='email' className='sr-only'>
								Email
							</label>
							<input
								id='email'
								name='email'
								type='email'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm '
								placeholder='nick@notium.com'
							/>
						</div>
						<div>
							<label htmlFor='password' className='sr-only'>
								Password
							</label>
							<input
								id='password'
								name='password'
								type='password'
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
								placeholder='Password'
							/>
						</div>
						<div>
							<label htmlFor='password' className='sr-only'>
								Password
							</label>
							<input
								id='confirmPassword'
								name='confirmPassword'
								type='password'
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
								placeholder='Confirm Password'
							/>
						</div>
					</div>

					<div className='grid gap-4'>
						<button
							type='submit'
							onClick={() => navigate('/sign-up')}
							className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'>
							{isLoading ? 'Signing up...' : 'Sign Up'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
