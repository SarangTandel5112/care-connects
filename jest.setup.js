import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        }
    },
    useSearchParams() {
        return new URLSearchParams()
    },
    usePathname() {
        return '/'
    },
}))

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(() => ({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
    })),
    useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        mutateAsync: jest.fn(),
        isLoading: false,
        isError: false,
        error: null,
    })),
    useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
        setQueryData: jest.fn(),
        clear: jest.fn(),
    })),
    QueryClient: jest.fn(),
    QueryClientProvider: ({ children }) => children,
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        loading: jest.fn(),
    },
    Toaster: () => null,
}))

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

// Suppress console warnings in tests
const originalError = console.error
beforeAll(() => {
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is no longer supported')
        ) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})