import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatients } from '@/modules/patient/hooks/usePatient';
import PatientsListPage from '@/modules/patient/components/PatientsList';

// Mock the patient hooks
jest.mock('@/modules/patient/hooks/usePatient', () => ({
  usePatients: jest.fn(),
  useCreatePatient: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useDeletePatient: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

const mockUsePatients = usePatients as jest.MockedFunction<typeof usePatients>;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const mockPatientsData = {
  patients: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      status: 'active',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0124',
      status: 'inactive',
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
  },
};

describe('PatientsListPage', () => {
  beforeEach(() => {
    mockUsePatients.mockReturnValue({
      data: mockPatientsData,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders patients list', () => {
    render(
      <TestWrapper>
        <PatientsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Patients')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUsePatients.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <PatientsListPage />
      </TestWrapper>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUsePatients.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch patients'),
    });

    render(
      <TestWrapper>
        <PatientsListPage />
      </TestWrapper>
    );

    expect(screen.getByText(/error:/i)).toBeInTheDocument();
  });

  it('opens create patient modal when add button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <PatientsListPage />
      </TestWrapper>
    );

    const addButton = screen.getByRole('button', { name: /add new patient/i });
    await user.click(addButton);

    expect(screen.getByText('Create New Patient')).toBeInTheDocument();
  });

  it('displays patient status correctly', () => {
    render(
      <TestWrapper>
        <PatientsListPage />
      </TestWrapper>
    );

    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('inactive')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <PatientsListPage />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/search patients/i);
    await user.type(searchInput, 'John');

    await waitFor(() => {
      expect(mockUsePatients).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'John',
        })
      );
    });
  });

  it('handles status filter', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <PatientsListPage />
      </TestWrapper>
    );

    const statusSelect = screen.getByDisplayValue(/all status/i);
    await user.selectOptions(statusSelect, 'active');

    await waitFor(() => {
      expect(mockUsePatients).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'active',
        })
      );
    });
  });
});
