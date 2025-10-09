import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Button from '@/components/ui/Button/Button';

// Test wrapper with providers
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

describe('Button Component', () => {
  it('renders button with children', () => {
    render(
      <TestWrapper>
        <Button>Click me</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Button onClick={handleClick}>Click me</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(
      <TestWrapper>
        <Button isLoading>Loading</Button>
      </TestWrapper>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(
      <TestWrapper>
        <Button variant="primary">Primary</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toHaveClass('bg-primary-600');

    rerender(
      <TestWrapper>
        <Button variant="secondary">Secondary</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toHaveClass('bg-secondary-200');
  });

  it('applies correct size styles', () => {
    const { rerender } = render(
      <TestWrapper>
        <Button size="sm">Small</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(
      <TestWrapper>
        <Button size="lg">Large</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <TestWrapper>
        <Button disabled>Disabled</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards additional props', () => {
    render(
      <TestWrapper>
        <Button data-testid="custom-button" type="submit">
          Submit
        </Button>
      </TestWrapper>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
