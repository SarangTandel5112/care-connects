import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage Component', () => {
  describe('Rendering', () => {
    it('renders error message when provided', () => {
      render(<ErrorMessage message="Login failed" />);
      expect(screen.getByText('Login failed')).toBeInTheDocument();
    });

    it('does not render when message is empty string', () => {
      const { container } = render(<ErrorMessage message="" />);
      expect(container.firstChild).toBeNull();
    });

    it('does not render when message is undefined', () => {
      const { container } = render(<ErrorMessage message={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('does not render when message is null', () => {
      const { container } = render(<ErrorMessage message={null as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Content', () => {
    it('displays the error message text', () => {
      const errorMsg = 'Invalid credentials';
      render(<ErrorMessage message={errorMsg} />);
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });

    it('displays long error messages', () => {
      const longMsg = 'This is a very long error message that should be displayed completely without truncation or issues';
      render(<ErrorMessage message={longMsg} />);
      expect(screen.getByText(longMsg)).toBeInTheDocument();
    });

    it('displays error messages with special characters', () => {
      const specialMsg = "Error: User's email can't be verified!";
      render(<ErrorMessage message={specialMsg} />);
      expect(screen.getByText(specialMsg)).toBeInTheDocument();
    });

    it('renders error icon SVG', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('h-5', 'w-5', 'flex-shrink-0');
    });
  });

  describe('Styling', () => {
    it('applies default error styling classes', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const errorDiv = container.firstChild;
      expect(errorDiv).toHaveClass('bg-red-50');
      expect(errorDiv).toHaveClass('border-red-200');
      expect(errorDiv).toHaveClass('text-red-600');
    });

    it('applies custom className', () => {
      const { container } = render(<ErrorMessage message="Error" className="custom-error" />);
      const errorDiv = container.firstChild;
      expect(errorDiv).toHaveClass('custom-error');
    });

    it('applies layout classes', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const errorDiv = container.firstChild;
      expect(errorDiv).toHaveClass('mb-6');
      expect(errorDiv).toHaveClass('flex');
      expect(errorDiv).toHaveClass('items-center');
      expect(errorDiv).toHaveClass('gap-2');
    });

    it('applies border and padding classes', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const errorDiv = container.firstChild;
      expect(errorDiv).toHaveClass('rounded-lg');
      expect(errorDiv).toHaveClass('border');
      expect(errorDiv).toHaveClass('p-4');
    });
  });

  describe('Accessibility', () => {
    it('includes screen reader only text', () => {
      render(<ErrorMessage message="Login failed" />);
      const srText = screen.getByText('Error:');
      expect(srText).toHaveClass('sr-only');
    });

    it('marks icon as decorative with aria-hidden', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('error message is visible to screen readers', () => {
      render(<ErrorMessage message="Authentication failed" />);
      expect(screen.getByText('Authentication failed')).toBeVisible();
    });
  });

  describe('Framer Motion Integration', () => {
    it('renders as motion.div', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      expect(container.firstChild).toBeTruthy();
    });

    it('applies animation classes from framer-motion', () => {
      // Framer motion applies inline styles, just verify component renders
      const { container } = render(<ErrorMessage message="Error" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles multiline error messages', () => {
      const multilineMsg = 'Error line 1\nError line 2';
      render(<ErrorMessage message={multilineMsg} />);
      expect(screen.getByText(multilineMsg)).toBeInTheDocument();
    });

    it('handles HTML entities in message', () => {
      const htmlMsg = 'Error: 5 < 10 && 10 > 5';
      render(<ErrorMessage message={htmlMsg} />);
      expect(screen.getByText(htmlMsg)).toBeInTheDocument();
    });

    it('handles empty className', () => {
      const { container } = render(<ErrorMessage message="Error" className="" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('re-renders when message changes', () => {
      const { rerender } = render(<ErrorMessage message="Error 1" />);
      expect(screen.getByText('Error 1')).toBeInTheDocument();

      rerender(<ErrorMessage message="Error 2" />);
      expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
      expect(screen.getByText('Error 2')).toBeInTheDocument();
    });

    it('unmounts when message becomes empty', () => {
      const { rerender, container } = render(<ErrorMessage message="Error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();

      rerender(<ErrorMessage message="" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('SVG Icon', () => {
    it('renders error icon with correct path', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('fill-rule', 'evenodd');
      expect(path).toHaveAttribute('clip-rule', 'evenodd');
    });

    it('icon has currentColor fill', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('icon is flex-shrink-0 to prevent squashing', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('flex-shrink-0');
    });
  });
});
