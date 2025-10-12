import { render, screen } from '@testing-library/react';
import { EyeIcon, EyeSlashIcon } from '../EyeIcon';

describe('EyeIcon Components', () => {
  describe('EyeIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<EyeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox', () => {
      const { container } = render(<EyeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('applies default className', () => {
      const { container } = render(<EyeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-5', 'w-5');
    });

    it('applies custom className', () => {
      const { container } = render(<EyeIcon className="h-6 w-6 text-blue-500" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-6', 'w-6', 'text-blue-500');
    });

    it('renders with currentColor stroke', () => {
      const { container } = render(<EyeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('has no fill by default', () => {
      const { container } = render(<EyeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('renders two path elements', () => {
      const { container } = render(<EyeIcon />);
      const paths = container.querySelectorAll('path');
      expect(paths).toHaveLength(2);
    });

    it('forwards additional props', () => {
      const { container } = render(<EyeIcon data-testid="eye-icon" aria-label="Show" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('data-testid', 'eye-icon');
      expect(svg).toHaveAttribute('aria-label', 'Show');
    });
  });

  describe('EyeSlashIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<EyeSlashIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox', () => {
      const { container } = render(<EyeSlashIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('applies default className', () => {
      const { container } = render(<EyeSlashIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-5', 'w-5');
    });

    it('applies custom className', () => {
      const { container } = render(<EyeSlashIcon className="h-8 w-8 text-red-500" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-8', 'w-8', 'text-red-500');
    });

    it('renders with currentColor stroke', () => {
      const { container } = render(<EyeSlashIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('has no fill by default', () => {
      const { container } = render(<EyeSlashIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('renders path element', () => {
      const { container } = render(<EyeSlashIcon />);
      const paths = container.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });

    it('forwards additional props', () => {
      const { container } = render(<EyeSlashIcon data-testid="eye-slash-icon" aria-label="Hide" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('data-testid', 'eye-slash-icon');
      expect(svg).toHaveAttribute('aria-label', 'Hide');
    });
  });

  describe('Icon Comparison', () => {
    it('EyeIcon and EyeSlashIcon are different', () => {
      const { container: eyeContainer } = render(<EyeIcon />);
      const { container: slashContainer } = render(<EyeSlashIcon />);

      const eyePaths = eyeContainer.querySelectorAll('path');
      const slashPaths = slashContainer.querySelectorAll('path');

      // They should have different SVG content
      expect(eyePaths[0]?.getAttribute('d')).not.toBe(slashPaths[0]?.getAttribute('d'));
    });

    it('both icons accept same props interface', () => {
      const commonProps = {
        className: 'h-6 w-6',
        'data-testid': 'test-icon',
      };

      const { container: eyeContainer } = render(<EyeIcon {...commonProps} />);
      const { container: slashContainer } = render(<EyeSlashIcon {...commonProps} />);

      expect(eyeContainer.querySelector('svg')).toHaveClass('h-6', 'w-6');
      expect(slashContainer.querySelector('svg')).toHaveClass('h-6', 'w-6');
    });
  });

  describe('Accessibility', () => {
    it('EyeIcon supports aria-label', () => {
      const { container } = render(<EyeIcon aria-label="Show password" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-label', 'Show password');
    });

    it('EyeSlashIcon supports aria-label', () => {
      const { container } = render(<EyeSlashIcon aria-label="Hide password" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-label', 'Hide password');
    });

    it('supports aria-hidden', () => {
      const { container } = render(<EyeIcon aria-hidden="true" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
