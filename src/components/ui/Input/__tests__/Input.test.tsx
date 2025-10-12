import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input Component', () => {
  describe('Basic Rendering', () => {
    it('renders input without label', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders input with label', () => {
      render(<Input label="Username" placeholder="Enter username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<Input label="Email" error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
    });

    it('applies custom className', () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('renders as disabled', () => {
      render(<Input disabled placeholder="Disabled input" />);
      expect(screen.getByPlaceholderText('Disabled input')).toBeDisabled();
      expect(screen.getByRole('textbox')).toHaveClass('disabled:bg-gray-100');
    });
  });

  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('renders email input', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('renders number input', () => {
      render(<Input type="number" />);
      // Number inputs don't have the textbox role
      const input = document.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Password Field', () => {
    it('renders password input with toggle button', () => {
      render(<Input type="password" placeholder="Enter password" />);

      const input = screen.getByPlaceholderText('Enter password');
      expect(input).toHaveAttribute('type', 'password');

      const toggleButton = screen.getByLabelText('Show password');
      expect(toggleButton).toBeInTheDocument();
    });

    it('toggles password visibility', async () => {
      const user = userEvent.setup();
      render(<Input type="password" placeholder="Enter password" />);

      const input = screen.getByPlaceholderText('Enter password');
      const toggleButton = screen.getByLabelText('Show password');

      // Initially hidden
      expect(input).toHaveAttribute('type', 'password');

      // Click to show
      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Hide password')).toBeInTheDocument();

      // Click to hide again
      await user.click(screen.getByLabelText('Hide password'));
      expect(input).toHaveAttribute('type', 'password');
      expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    });

    it('applies padding for password toggle button', () => {
      render(<Input type="password" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-10');
    });
  });

  describe('User Interactions', () => {
    it('handles onChange event', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<Input onChange={handleChange} placeholder="Type here" />);

      const input = screen.getByPlaceholderText('Type here');
      await user.type(input, 'Hello');

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('Hello');
    });

    it('handles onFocus event', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles onBlur event', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('allows programmatic focus via ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has accessible label association', () => {
      render(<Input label="Full Name" />);
      const input = screen.getByLabelText('Full Name');
      expect(input).toBeInTheDocument();
    });

    it('has accessible error message', () => {
      render(<Input label="Email" error="Invalid email format" />);
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    it('password toggle has accessible label', () => {
      render(<Input type="password" />);
      expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    });

    it('supports aria-describedby for error', () => {
      render(<Input aria-describedby="error-message" error="Error text" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'error-message');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty error string', () => {
      render(<Input error="" />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('handles undefined error', () => {
      render(<Input error={undefined} />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('handles very long error messages', () => {
      const longError = 'This is a very long error message that should still be displayed properly without breaking the layout or causing any issues';
      render(<Input error={longError} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('handles special characters in value', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.type(input, '!@#$%^&*()');

      expect(input).toHaveValue('!@#$%^&*()');
    });
  });

  describe('Styling States', () => {
    it('applies error border when error exists', () => {
      render(<Input error="Error message" />);
      expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
    });

    it('applies normal border when no error', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('border-gray-300');
    });

    it('applies focus ring styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
    });

    it('applies disabled styles', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toHaveClass('disabled:bg-gray-100', 'disabled:cursor-not-allowed');
    });
  });
});
