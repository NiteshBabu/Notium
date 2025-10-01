import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = 'http://localhost:8000/api'

const apiClient: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const token = localStorage.getItem('token')
		// await new Promise(res => setTimeout(res, 3000))
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (
			error.response?.status === 401 &&
			window.location.pathname !== '/login'
		) {
			localStorage.removeItem('token')
			window.location.href = '/login'
		}
		return Promise.reject(error)
	}
)

export default apiClient
