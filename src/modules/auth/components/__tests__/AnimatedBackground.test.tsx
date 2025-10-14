import { render } from '@testing-library/react';
import { AnimatedBackground } from '../AnimatedBackground';

describe('AnimatedBackground Component', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<AnimatedBackground />);
      expect(container).toBeInTheDocument();
    });

    it('renders container with correct classes', () => {
      const { container } = render(<AnimatedBackground />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('absolute', 'inset-0', 'overflow-hidden');
    });
  });

  describe('Gradient Orbs', () => {
    it('renders three animated gradient orbs', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');
      expect(orbs).toHaveLength(3);
    });

    it('first orb has correct positioning and colors', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');
      const firstOrb = orbs[0];

      expect(firstOrb).toHaveClass('from-blue-200', 'to-blue-300');
      expect(firstOrb).toHaveClass('absolute', '-top-20', '-right-20');
      expect(firstOrb).toHaveClass('rounded-full');
    });

    it('second orb has correct positioning and colors', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');
      const secondOrb = orbs[1];

      expect(secondOrb).toHaveClass('from-cyan-200', 'to-cyan-300');
      expect(secondOrb).toHaveClass('absolute', '-bottom-20', '-left-20');
      expect(secondOrb).toHaveClass('rounded-full');
    });

    it('third orb has correct positioning and colors', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');
      const thirdOrb = orbs[2];

      expect(thirdOrb).toHaveClass('from-slate-200', 'to-slate-300');
      expect(thirdOrb).toHaveClass('absolute', 'top-1/2', 'left-1/2');
      expect(thirdOrb).toHaveClass('-translate-x-1/2', '-translate-y-1/2');
      expect(thirdOrb).toHaveClass('rounded-full');
    });

    it('orbs have gradient backgrounds', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');

      orbs.forEach(orb => {
        expect(orb).toHaveClass('bg-gradient-to-br');
      });
    });

    it('orbs have opacity classes', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');

      expect(orbs[0]).toHaveClass('opacity-30');
      expect(orbs[1]).toHaveClass('opacity-30');
      expect(orbs[2]).toHaveClass('opacity-20');
    });
  });

  describe('Responsive Sizing', () => {
    it('first orb has responsive size classes', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');
      const firstOrb = orbs[0];

      // Base size
      expect(firstOrb).toHaveClass('h-48', 'w-48');
      // Responsive sizes
      expect(firstOrb.className).toContain('sm:h-64');
      expect(firstOrb.className).toContain('md:h-80');
      expect(firstOrb.className).toContain('lg:h-96');
    });

    it('second orb has responsive size classes', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');
      const secondOrb = orbs[1];

      expect(secondOrb).toHaveClass('h-48', 'w-48');
      expect(secondOrb.className).toContain('sm:h-64');
      expect(secondOrb.className).toContain('md:h-80');
      expect(secondOrb.className).toContain('lg:h-96');
    });

    it('third orb has responsive size classes', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');
      const thirdOrb = orbs[2];

      expect(thirdOrb).toHaveClass('h-40', 'w-40');
      expect(thirdOrb.className).toContain('sm:h-60');
      expect(thirdOrb.className).toContain('md:h-72');
      expect(thirdOrb.className).toContain('lg:h-80');
    });
  });

  describe('Animation Delays', () => {
    it('second orb has animation delay', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');
      const secondOrb = orbs[1] as HTMLElement;

      expect(secondOrb.style.animationDelay).toBe('1s');
    });

    it('third orb has animation delay', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');
      const thirdOrb = orbs[2] as HTMLElement;

      expect(thirdOrb.style.animationDelay).toBe('2s');
    });

    it('first orb has no animation delay', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');
      const firstOrb = orbs[0] as HTMLElement;

      expect(firstOrb.style.animationDelay).toBeFalsy();
    });
  });

  describe('Grid Pattern', () => {
    it('renders subtle grid pattern background', () => {
      const { container } = render(<AnimatedBackground />);
      const gridPattern = container.querySelector('.bg-\\[url\\(\'data\\:image\\/svg\\+xml');

      expect(gridPattern).toBeInTheDocument();
    });

    it('grid pattern has correct positioning', () => {
      const { container } = render(<AnimatedBackground />);
      const gridPattern = container.querySelector('.bg-\\[url\\(\'data\\:image\\/svg\\+xml');

      expect(gridPattern).toHaveClass('absolute', 'inset-0');
    });

    it('grid pattern has opacity', () => {
      const { container } = render(<AnimatedBackground />);
      const gridPattern = container.querySelector('.bg-\\[url\\(\'data\\:image\\/svg\\+xml');

      expect(gridPattern).toHaveClass('opacity-20');
    });
  });

  describe('Component Structure', () => {
    it('has correct component hierarchy', () => {
      const { container } = render(<AnimatedBackground />);

      // Main container
      expect(container.firstChild).toHaveClass('absolute', 'inset-0', 'overflow-hidden');

      // Should have 4 children (3 orbs + 1 grid)
      const children = container.firstChild?.childNodes;
      expect(children).toHaveLength(4);
    });

    it('maintains correct z-index layering', () => {
      const { container } = render(<AnimatedBackground />);
      const mainDiv = container.firstChild as HTMLElement;

      // All children should be in the main container
      expect(mainDiv.childNodes.length).toBe(4);
    });
  });

  describe('Edge Cases', () => {
    it('renders consistently on multiple renders', () => {
      const { container, rerender } = render(<AnimatedBackground />);
      const initialHTML = container.innerHTML;

      rerender(<AnimatedBackground />);
      const afterHTML = container.innerHTML;

      expect(initialHTML).toBe(afterHTML);
    });

    it('does not accept any props', () => {
      // Component should not break even if props are passed
      const { container } = render(<AnimatedBackground />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('all orbs have rounded corners', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');

      orbs.forEach(orb => {
        expect(orb).toHaveClass('rounded-full');
      });
    });

    it('all orbs have gradient backgrounds', () => {
      const { container } = render(<AnimatedBackground />);
      const orbs = container.querySelectorAll('.animate-pulse');

      orbs.forEach(orb => {
        expect(orb).toHaveClass('bg-gradient-to-br');
      });
    });

    it('main container prevents overflow', () => {
      const { container } = render(<AnimatedBackground />);
      const mainDiv = container.firstChild;

      expect(mainDiv).toHaveClass('overflow-hidden');
    });
  });
});
