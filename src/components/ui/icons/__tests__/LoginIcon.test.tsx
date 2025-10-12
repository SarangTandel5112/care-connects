import { render } from '@testing-library/react';
import { LoginIcon } from '../LoginIcon';

describe('LoginIcon Component', () => {
  describe('Rendering', () => {
    it('renders SVG element', () => {
      const { container } = render(<LoginIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox', () => {
      const { container } = render(<LoginIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('applies default className', () => {
      const { container } = render(<LoginIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-4', 'w-4');
    });

    it('applies custom className', () => {
      const { container } = render(<LoginIcon className="h-6 w-6 text-blue-500" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-6', 'w-6', 'text-blue-500');
    });

    it('renders with currentColor stroke', () => {
      const { container } = render(<LoginIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('has no fill by default', () => {
      const { container } = render(<LoginIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });
  });

  describe('SVG Content', () => {
    it('renders path element with correct attributes', () => {
      const { container } = render(<LoginIcon />);
      const path = container.querySelector('path');

      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('stroke-linecap', 'round');
      expect(path).toHaveAttribute('stroke-linejoin', 'round');
      expect(path).toHaveAttribute('stroke-width', '2');
    });

    it('has correct path definition for login arrow', () => {
      const { container } = render(<LoginIcon />);
      const path = container.querySelector('path');
      const pathD = path?.getAttribute('d');

      expect(pathD).toBeTruthy();
      expect(pathD).toContain('M11 16l-4-4'); // Arrow movement
    });
  });

  describe('Props Forwarding', () => {
    it('forwards additional props to SVG', () => {
      const { container } = render(<LoginIcon data-testid="login-icon" aria-label="Login" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('data-testid', 'login-icon');
      expect(svg).toHaveAttribute('aria-label', 'Login');
    });

    it('supports onClick handler', () => {
      const handleClick = jest.fn();
      const { container } = render(<LoginIcon onClick={handleClick} />);
      const svg = container.querySelector('svg');

      svg?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('supports style prop', () => {
      const { container } = render(<LoginIcon style={{ opacity: 0.5 }} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveStyle({ opacity: '0.5' });
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      const { container } = render(<LoginIcon aria-label="Sign in" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-label', 'Sign in');
    });

    it('supports aria-hidden', () => {
      const { container } = render(<LoginIcon aria-hidden="true" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('can be used as decorative icon', () => {
      const { container } = render(<LoginIcon role="presentation" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'presentation');
    });
  });

  describe('Customization', () => {
    it('accepts different sizes', () => {
      const { container: small } = render(<LoginIcon className="h-3 w-3" />);
      const { container: large } = render(<LoginIcon className="h-8 w-8" />);

      expect(small.querySelector('svg')).toHaveClass('h-3', 'w-3');
      expect(large.querySelector('svg')).toHaveClass('h-8', 'w-8');
    });

    it('accepts color classes', () => {
      const { container } = render(<LoginIcon className="text-blue-600" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-blue-600');
    });

    it('combines custom className with defaults', () => {
      const { container } = render(<LoginIcon className="h-10 w-10 text-green-500 rotate-45" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveClass('h-10', 'w-10', 'text-green-500', 'rotate-45');
    });
  });

  describe('Edge Cases', () => {
    it('renders without any props', () => {
      const { container } = render(<LoginIcon />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles empty className', () => {
      const { container } = render(<LoginIcon className="" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders consistently on multiple renders', () => {
      const { container, rerender } = render(<LoginIcon />);
      const initialHTML = container.innerHTML;

      rerender(<LoginIcon />);
      const afterHTML = container.innerHTML;

      expect(initialHTML).toBe(afterHTML);
    });
  });

  describe('Integration', () => {
    it('works in button context', () => {
      const { container } = render(
        <button>
          <LoginIcon className="mr-2" />
          Sign In
        </button>
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('mr-2');
    });

    it('can be used multiple times in same component', () => {
      const { container } = render(
        <div>
          <LoginIcon className="h-4 w-4" />
          <LoginIcon className="h-6 w-6" />
          <LoginIcon className="h-8 w-8" />
        </div>
      );

      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(3);
    });
  });
});
