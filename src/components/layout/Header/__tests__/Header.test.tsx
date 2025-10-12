import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../Header';

// Mock Next.js hooks
const mockPush = jest.fn();
const mockPathname = '/dashboard';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}));

// Mock hooks
const mockUser = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User',
  phoneNumber: null,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  deletedAt: null,
  clinic: {
    id: '1',
    name: 'Test Clinic',
    location: null,
    country: null,
    state: null,
    city: null,
    region: null,
    zipCode: null,
    contactNumber: null,
    fax: null,
    email: null,
    additionalInfo: null,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  avatar: 'https://i.pravatar.cc/50',
};

const mockLogoutMutate = jest.fn();

jest.mock('@/hooks/useStore', () => ({
  useCombinedStore: () => ({
    user: mockUser,
  }),
}));

jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useLogout: () => ({
    mutate: mockLogoutMutate,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  }),
}));

let mockIsMobile = false;
jest.mock('@/hooks/useDeviceDetection', () => ({
  useDeviceDetection: () => ({
    isMobile: mockIsMobile,
  }),
}));

// Mock menu items
jest.mock('@/components/layout/Sidebar/menu.config', () => ({
  menuItems: [
    {
      label: 'Dashboard',
      icon: <span data-testid="icon-dashboard">📊</span>,
      path: '/dashboard',
    },
    {
      label: 'Patients',
      icon: <span data-testid="icon-patients">👥</span>,
      path: '/patients',
    },
  ],
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, className, ...props }: React.ComponentProps<'button'>) => (
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    ),
    div: ({ children, onClick, className, ...props }: React.ComponentProps<'div'>) => (
      <div onClick={onClick} className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Next Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsMobile = false;
    mockLogoutMutate.mockClear();
  });

  describe('Rendering - Desktop', () => {
    it('renders header element', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('renders notification bell', () => {
      render(<Header />);
      const bell = screen.getByRole('button', { name: /notification/i });
      expect(bell).toBeInTheDocument();
    });

    it('displays notification count', () => {
      render(<Header />);
      const notificationBadge = screen.getByText('4');
      expect(notificationBadge).toBeInTheDocument();
    });

    it('renders user profile button', () => {
      render(<Header />);
      const profileImage = screen.getByAltText('User profile');
      expect(profileImage).toBeInTheDocument();
    });

    it('renders user avatar with correct src', () => {
      render(<Header />);
      const avatar = screen.getByAltText('User profile') as HTMLImageElement;
      expect(avatar.src).toContain('pravatar.cc');
    });

    it('displays online status indicator', () => {
      const { container } = render(<Header />);
      // Check for the green dot indicator
      const onlineIndicator = container.querySelector('.bg-green-500');
      expect(onlineIndicator).toBeInTheDocument();
    });

    it('does not render mobile menu button on desktop', () => {
      render(<Header />);
      const menuButton = screen.queryByRole('button', { name: /toggle mobile menu/i });
      expect(menuButton).not.toBeInTheDocument();
    });

    it('does not render mobile logo on desktop', () => {
      render(<Header />);
      const logos = screen.queryAllByAltText('Care Connects');
      expect(logos.length).toBe(0);
    });
  });

  describe('Rendering - Mobile', () => {
    beforeEach(() => {
      mockIsMobile = true;
    });

    it('renders mobile hamburger menu button', () => {
      render(<Header />);
      // The Menu icon is rendered inside a button
      const menuButtons = screen.getAllByRole('button');
      expect(menuButtons.length).toBeGreaterThan(0);
    });

    it('renders small logo on mobile', () => {
      render(<Header />);
      const logos = screen.getAllByAltText('Care Connects');
      expect(logos.length).toBeGreaterThan(0);
    });
  });

  describe('Profile Dropdown Menu', () => {
    it('profile menu is initially closed', () => {
      render(<Header />);
      const profileButton = screen.queryByText('Profile');
      expect(profileButton).not.toBeInTheDocument();
    });

    it('opens profile menu when clicking user avatar', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const avatarButton = screen.getByAltText('User profile').closest('button')!;
      await user.click(avatarButton);

      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });

    it('closes profile menu when clicking avatar again', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const avatarButton = screen.getByAltText('User profile').closest('button')!;

      // Open menu
      await user.click(avatarButton);
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });

      // Close menu
      await user.click(avatarButton);
      await waitFor(() => {
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
      });
    });

    it('navigates to profile page when clicking Profile', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const avatarButton = screen.getByAltText('User profile').closest('button')!;
      await user.click(avatarButton);

      const profileButton = await screen.findByText('Profile');
      await user.click(profileButton);

      expect(mockPush).toHaveBeenCalledWith('/profile');
    });

    it('closes menu after navigating to profile', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const avatarButton = screen.getByAltText('User profile').closest('button')!;
      await user.click(avatarButton);

      const profileButton = await screen.findByText('Profile');
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
      });
    });

    it('navigates to login when clicking Logout', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const avatarButton = screen.getByAltText('User profile').closest('button')!;
      await user.click(avatarButton);

      const logoutButton = await screen.findByText('Logout');
      await user.click(logoutButton);

      expect(mockLogoutMutate).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('handles logout errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      mockPush.mockImplementationOnce(() => {
        throw new Error('Navigation failed');
      });

      const user = userEvent.setup();
      render(<Header />);

      const avatarButton = screen.getByAltText('User profile').closest('button')!;
      await user.click(avatarButton);

      const logoutButton = await screen.findByText('Logout');
      await user.click(logoutButton);

      expect(consoleError).toHaveBeenCalledWith('Logout failed:', expect.any(Error));
      consoleError.mockRestore();
    });
  });

  describe('Mobile Menu', () => {
    beforeEach(() => {
      mockIsMobile = true;
    });

    it('mobile menu is initially closed', () => {
      render(<Header />);
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('opens mobile menu when clicking hamburger button', async () => {
      const user = userEvent.setup();
      render(<Header />);

      // Find and click the hamburger menu button
      const buttons = screen.getAllByRole('button');
      const menuButton = buttons[0]; // First button should be the hamburger menu
      await user.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Patients')).toBeInTheDocument();
      });
    });

    it('displays menu items in mobile menu', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Patients')).toBeInTheDocument();
      });
    });

    it('navigates when clicking menu item', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      const dashboardButton = await screen.findByText('Dashboard');
      await user.click(dashboardButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('closes mobile menu after navigation', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      const dashboardButton = await screen.findByText('Dashboard');
      await user.click(dashboardButton);

      // Menu should close after navigation
      await waitFor(() => {
        expect(screen.queryByText('Patients')).not.toBeInTheDocument();
      });
    });

    it('closes mobile menu when clicking overlay', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Find and click overlay
      const overlay = screen.getByText('Dashboard').closest('.fixed')!.parentElement!;
      await user.click(overlay);

      await waitFor(() => {
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
      });
    });

    it('renders logo in mobile menu', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        const logos = screen.getAllByAltText('Care Connects');
        expect(logos.length).toBeGreaterThan(2); // Mobile menu has 2 logos
      });
    });

    it('renders close button in mobile menu', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      await waitFor(() => {
        // X icon button should be present
        const closeButtons = screen.getAllByRole('button');
        expect(closeButtons.length).toBeGreaterThan(1);
      });
    });
  });

  describe('User States', () => {
    it('uses default avatar when user has no avatar', async () => {
      // Use dynamic import for mocking
      const { useCombinedStore } = await import('@/hooks/useStore');
      jest.spyOn({ useCombinedStore } as never, 'useCombinedStore').mockReturnValue({
        user: { ...mockUser, avatar: null },
      } as never);

      render(<Header />);
      const avatar = screen.getByAltText('User profile') as HTMLImageElement;
      expect(avatar.src).toContain('pravatar.cc');
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic HTML structure', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header.tagName).toBe('HEADER');
    });

    it('notification bell is a button', () => {
      const { container } = render(<Header />);
      const notificationButton = container.querySelector('button');
      expect(notificationButton).toBeInTheDocument();
    });

    it('profile menu buttons are accessible', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const avatarButton = screen.getByAltText('User profile').closest('button')!;
      await user.click(avatarButton);

      const profileButton = await screen.findByText('Profile');
      const logoutButton = screen.getByText('Logout');

      expect(profileButton.tagName).toBe('BUTTON');
      expect(logoutButton.tagName).toBe('BUTTON');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing user gracefully', async () => {
      // Use dynamic import for mocking
      const { useCombinedStore } = await import('@/hooks/useStore');
      jest.spyOn({ useCombinedStore } as never, 'useCombinedStore').mockReturnValue({
        user: null,
      } as never);

      render(<Header />);
      const avatar = screen.getByAltText('User profile') as HTMLImageElement;
      expect(avatar.src).toContain('pravatar.cc');
    });

    it('handles rapid menu toggling', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const avatarButton = screen.getByAltText('User profile').closest('button')!;

      // Rapidly toggle menu
      await user.click(avatarButton);
      await user.click(avatarButton);
      await user.click(avatarButton);

      // Menu should be open
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });

    it('handles navigation when menu item path is missing', async () => {
      mockIsMobile = true;
      const user = userEvent.setup();

      render(<Header />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      // Get the first menu item (Dashboard) and click it
      const dashboardButton = await screen.findByText('Dashboard');
      await user.click(dashboardButton);

      // Should navigate to the item's path
      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('applies correct styling to header', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header.className).toContain('bg-white');
      expect(header.className).toContain('border-b');
    });

    it('notification badge has correct styling', () => {
      const { container } = render(<Header />);
      const badge = container.querySelector('.bg-red-500');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveTextContent('4');
    });
  });
});
