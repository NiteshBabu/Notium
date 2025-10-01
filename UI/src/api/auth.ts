import apiClient from './client'

export interface LoginCredentials {
	username: string
	password: string
}

export interface LoginResponse {
	access_token: string
	token_type: string
}
export interface RegisterPayload {
	username: string
	email: string
	password: string
}

export const authApi = {
	login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
		const response = await apiClient.post<LoginResponse>(
			'/auth/login',
			credentials
		)
		return response.data
	},
	register: async (payload: RegisterPayload): Promise<LoginResponse> => {
		const response = await apiClient.post('/auth/register', payload)
		return response.data
	},
}
