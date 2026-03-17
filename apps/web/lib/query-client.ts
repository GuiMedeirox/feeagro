import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error: unknown) => {
        const axiosError = error as { response?: { status: number } }
        if (axiosError?.response?.status === 401) return false
        if (axiosError?.response?.status === 404) return false
        return failureCount < 2
      },
    },
    mutations: {
      onError: () => {
        // Global mutation errors are handled per-mutation via toast
      },
    },
  },
})
