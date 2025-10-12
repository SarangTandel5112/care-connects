# Sidebar Component

A fully refactored, SOLID-compliant sidebar navigation component for Care Connects application.

## 📁 Folder Structure

```
Sidebar/
├── components/           # Sub-components (Single Responsibility)
│   ├── SidebarLogo.tsx       # Logo section component
│   ├── SidebarMenuItem.tsx   # Individual menu item component
│   ├── SidebarFooter.tsx     # Footer section component
│   └── index.ts              # Component exports
├── hooks/               # Custom hooks (Separation of Concerns)
│   ├── useDeviceDetection.ts # Device detection logic
│   ├── useSidebarState.ts    # Sidebar state management
│   └── index.ts              # Hook exports
├── Sidebar.tsx          # Main sidebar container (Composition)
├── menuConfig.tsx       # Menu configuration (Open/Closed Principle)
├── index.ts             # Public API exports
└── README.md            # This file
```

## 🎯 SOLID Principles Implementation

### ✅ Single Responsibility Principle (SRP)
Each file has ONE clear responsibility:

- **Sidebar.tsx**: Container composition and layout
- **SidebarLogo.tsx**: Logo display and dashboard navigation
- **SidebarMenuItem.tsx**: Menu item rendering and styling
- **SidebarFooter.tsx**: Footer hint display
- **useDeviceDetection.ts**: Device capability detection
- **useSidebarState.ts**: Sidebar expansion state management
- **menuConfig.tsx**: Navigation menu data configuration

### ✅ Open/Closed Principle (OCP)
- Add new menu items by editing `menuConfig.tsx` ONLY
- No need to modify `Sidebar.tsx` or other components
- Extensible through configuration, closed for modification

### ✅ Liskov Substitution Principle (LSP)
- All components accept props that extend React standard types
- Components can be replaced with alternatives that follow the same interface

### ✅ Interface Segregation Principle (ISP)
- Each component receives ONLY the props it needs
- No fat interfaces with unused properties
- Clear, minimal prop interfaces

### ✅ Dependency Inversion Principle (DIP)
- `Sidebar.tsx` depends on abstractions (hooks, components)
- Not tightly coupled to implementation details
- Easy to swap hooks or components with alternatives

## 🧩 Component Breakdown

### Main Component: `Sidebar.tsx`
```tsx
import { useSidebarState } from './hooks';
import { SidebarLogo, SidebarMenuItem, SidebarFooter } from './components';

// Composed from smaller, focused components
// Uses custom hooks for state management
```

**Responsibilities:**
- Compose sub-components
- Handle navigation routing
- Manage event handlers from hooks

---

### Sub-Components

#### `SidebarLogo.tsx`
```tsx
interface SidebarLogoProps {
  isExpanded: boolean;
}
```
**Responsibility:** Display logo with expand/collapse animation

#### `SidebarMenuItem.tsx`
```tsx
interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}
```
**Responsibility:** Render individual menu item with active state styling

#### `SidebarFooter.tsx`
```tsx
interface SidebarFooterProps {
  isExpanded: boolean;
}
```
**Responsibility:** Display collapse hint with directional arrow

---

### Custom Hooks

#### `useDeviceDetection.ts`
```tsx
const { isTouchDevice, isMobile } = useDeviceDetection();
```
**Returns:** Device capabilities (touch support, mobile screen)

#### `useSidebarState.ts`
```tsx
const {
  isExpanded,
  isTouchDevice,
  isMobile,
  handleMouseEnter,
  handleMouseLeave,
  handleTouchStart,
  handleTouchEnd,
} = useSidebarState();
```
**Returns:** Sidebar state and event handlers

---

### Configuration

#### `menuConfig.tsx`
```tsx
export const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <Home size={20} />,
    path: '/dashboard',
  },
  // ... more items
];
```
**Purpose:** Centralized menu configuration

## 🎨 Features

### Visual Features
- ✅ Smooth hover expansion (desktop)
- ✅ Touch-friendly expansion (mobile)
- ✅ Gradient hover effects (blue to indigo)
- ✅ Active state with gradient background
- ✅ White indicator bar on active items
- ✅ Professional shadow effects
- ✅ Responsive width transitions

### Technical Features
- ✅ Device detection (touch/mouse)
- ✅ Mobile responsive
- ✅ Keyboard accessible
- ✅ Semantic HTML (`<aside>`, `<nav>`)
- ✅ Type-safe with TypeScript
- ✅ Clean prop interfaces

## 📝 Usage

### Basic Usage
```tsx
import { Sidebar } from '@/components/layout/Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### Adding a New Menu Item
Edit `menuConfig.tsx` only:

```tsx
import { Settings } from 'lucide-react';

export const menuItems: MenuItem[] = [
  // ... existing items
  {
    label: 'Settings',
    icon: <Settings size={20} />,
    path: '/settings',
  },
];
```

### Custom Menu Item with onClick
```tsx
{
  label: 'Logout',
  icon: <LogOut size={20} />,
  onClick: (e) => {
    e.preventDefault();
    handleLogout();
  },
}
```

## 🧪 Testing Considerations

### Unit Tests
- Test `useDeviceDetection` hook independently
- Test `useSidebarState` hook independently
- Test each sub-component in isolation
- Mock hooks in component tests

### Integration Tests
- Test navigation flow
- Test hover/touch interactions
- Test active state highlighting
- Test responsive behavior

## 🔧 Customization

### Changing Width
Edit `Sidebar.tsx`:
```tsx
// Collapsed width
className="w-16"

// Expanded width
isExpanded ? 'w-56' : 'w-16'
```

### Changing Colors
Edit respective component files:
```tsx
// Active state gradient
'bg-gradient-to-r from-blue-600 to-indigo-600'

// Hover gradient
'hover:from-blue-50 hover:to-indigo-50'
```

### Changing Animation Duration
```tsx
// In Tailwind classes
'transition-all duration-300'  // Change to duration-200, 500, etc.
```

## 📊 Before vs After Refactoring

### Before ❌
- 178 lines in a single file
- Mixed responsibilities (device detection, rendering, state)
- Hard to test
- Hard to extend
- Tightly coupled

### After ✅
- Main file: ~65 lines (63% reduction)
- Separated into 7 focused files
- Each file < 60 lines
- Easy to test in isolation
- Easy to extend via config
- Loosely coupled via hooks and props

## 🚀 Performance

- **No unnecessary re-renders**: Uses proper memoization
- **Efficient event listeners**: Cleanup on unmount
- **CSS animations**: Hardware-accelerated transitions
- **Minimal state**: Only what's necessary

## 🔗 Dependencies

- `next/navigation`: Routing
- `lucide-react`: Icons
- `@/utils/cn`: Class name utility (clsx wrapper)

## 📚 Related Files

- `src/components/layout/Header/` - Header component
- `src/app/(protected)/layout.tsx` - Protected layout using Sidebar
- `src/utils/cn.ts` - Tailwind class merger utility

## 🎓 Key Takeaways

1. **Separation of Concerns**: Each file has ONE job
2. **Composition over Inheritance**: Build complex UI from simple parts
3. **Custom Hooks**: Extract reusable logic
4. **Configuration over Code**: Use data structures for extensibility
5. **Type Safety**: TypeScript interfaces for all props
6. **Clean Code**: Small, focused, readable files

---

**Maintainer:** Care Connects Team
**Last Updated:** 2025-10-10
**Version:** 2.0.0 (Refactored)
