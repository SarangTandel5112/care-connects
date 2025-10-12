import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Field from '../Field';
import { UseFormRegisterReturn } from 'react-hook-form';

describe('Field Component', () => {
  describe('Basic Rendering', () => {
    it('renders field without props', () => {
      render(<Field />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders field with label', () => {
      render(<Field label="Username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('renders field with placeholder', () => {
      render(<Field placeholder="Enter your name" />);
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });

    it('renders field with error message', () => {
      render(<Field label="Email" error="Email is required" />);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  describe('React Hook Form Integration', () => {
    it('works with register prop', () => {
      const mockRegister: Partial<UseFormRegisterReturn> = {
        name: 'testField',
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
      };

      render(<Field register={mockRegister as UseFormRegisterReturn} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'testField');
    });

    it('calls register onChange', async () => {
      const mockOnChange = jest.fn();
      const mockRegister: Partial<UseFormRegisterReturn> = {
        name: 'testField',
        onChange: mockOnChange,
        onBlur: jest.fn(),
        ref: jest.fn(),
      };

      const user = userEvent.setup();
      render(<Field register={mockRegister as UseFormRegisterReturn} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('calls register onBlur', () => {
      const mockOnBlur = jest.fn();
      const mockRegister: Partial<UseFormRegisterReturn> = {
        name: 'testField',
        onChange: jest.fn(),
        onBlur: mockOnBlur,
        ref: jest.fn(),
      };

      render(<Field register={mockRegister as UseFormRegisterReturn} />);

      const input = screen.getByRole('textbox');
      input.focus();
      input.blur();

      expect(mockOnBlur).toHaveBeenCalled();
    });
  });

  describe('Input Types', () => {
    it('renders email field', () => {
      render(<Field type="email" label="Email Address" />);
      expect(screen.getByLabelText('Email Address')).toHaveAttribute('type', 'email');
    });

    it('renders password field', () => {
      render(<Field type="password" label="Password" />);
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });

    it('renders number field', () => {
      render(<Field type="number" label="Age" />);
      const input = document.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });

    it('renders text field by default', () => {
      render(<Field label="Name" />);
      expect(screen.getByLabelText('Name')).toHaveAttribute('type', 'text');
    });
  });

  describe('Forwarding Props', () => {
    it('forwards all input props to Input component', () => {
      render(
        <Field
          label="Test"
          placeholder="Test placeholder"
          disabled
          required
          maxLength={10}
          data-testid="test-field"
        />
      );

      const input = screen.getByTestId('test-field');
      expect(input).toBeDisabled();
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('maxLength', '10');
      expect(input).toHaveAttribute('placeholder', 'Test placeholder');
    });

    it('forwards className to Input', () => {
      render(<Field className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('forwards event handlers', async () => {
      const handleChange = jest.fn();
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      const user = userEvent.setup();
      render(
        <Field
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      );

      const input = screen.getByRole('textbox');

      input.focus();
      expect(handleFocus).toHaveBeenCalledTimes(1);

      await user.type(input, 'test');
      expect(handleChange).toHaveBeenCalled();

      input.blur();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Combined Props', () => {
    it('combines register props with custom props', () => {
      const mockRegister: Partial<UseFormRegisterReturn> = {
        name: 'email',
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
      };

      render(
        <Field
          register={mockRegister as UseFormRegisterReturn}
          label="Email"
          type="email"
          placeholder="user@example.com"
          error="Invalid email"
        />
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('name', 'email');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'user@example.com');
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('associates label with input', () => {
      render(<Field label="Full Name" />);
      const input = screen.getByLabelText('Full Name');
      expect(input).toBeInTheDocument();
    });

    it('shows error message accessibly', () => {
      render(<Field label="Email" error="Email is required" />);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('supports required attribute', () => {
      render(<Field label="Username" required />);
      expect(screen.getByLabelText('Username')).toBeRequired();
    });

    it('supports aria-label', () => {
      render(<Field aria-label="Search input" />);
      expect(screen.getByLabelText('Search input')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing register prop gracefully', () => {
      render(<Field label="Test" />);
      expect(screen.getByLabelText('Test')).toBeInTheDocument();
    });

    it('handles empty label', () => {
      render(<Field label="" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('handles empty error', () => {
      render(<Field error="" />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
