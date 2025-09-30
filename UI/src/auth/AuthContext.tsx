import React, {
	createContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import { authApi } from '../api/auth'
import type { LoginCredentials } from '../api/auth'

export interface AuthContextType {
	isAuthenticated: boolean
	login: (credentials: LoginCredentials) => Promise<void>
	logout: () => void
	isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		const token = localStorage.getItem('token')
		setIsAuthenticated(!!token)
		setIsLoading(false)
	}, [])

	const login = async (credentials: LoginCredentials): Promise<void> => {
		try {
			const response = await authApi.login(credentials)
			localStorage.setItem('token', response.access_token)
			setIsAuthenticated(true)
		} catch (error) {
			throw error
		}
	}

	const logout = (): void => {
		localStorage.removeItem('token')
		setIsAuthenticated(false)
	}

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	)
}
