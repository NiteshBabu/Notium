import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './global.css'
import { AppRouter } from './router'
import { AuthProvider } from './auth/AuthContext'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
})

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<AppRouter />
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
