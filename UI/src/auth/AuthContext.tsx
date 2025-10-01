import React, {
	createContext,
	useState,
	useEffect,
	type ReactNode,
} from 'react'
import { authApi } from '../api/auth'
import type { LoginCredentials, RegisterPayload } from '../api/auth'

export interface AuthContextType {
	isAuthenticated: boolean
	login: (credentials: LoginCredentials) => Promise<void>
	register: (payload: RegisterPayload) => Promise<void>
	logout: () => void
	isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
      console.log(error)
			throw error
		}
	}

	const logout = (): void => {
		localStorage.removeItem('token')
		setIsAuthenticated(false)
	}

	const register = async (payload: RegisterPayload): Promise<void> => {
		try {
			const response = await authApi.register(payload)
			localStorage.setItem('token', response.access_token)
			setIsAuthenticated(true)
		} catch (error) {
			throw error
		}
	}
	return (
		<AuthContext.Provider
			value={{ isAuthenticated, login, logout, register, isLoading }}>
			{children}
		</AuthContext.Provider>
	)
}
