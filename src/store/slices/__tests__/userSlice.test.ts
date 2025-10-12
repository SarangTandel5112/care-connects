import userReducer, {
  setUser,
  updateUser,
  clearUser,
  setLoading,
  setError,
  clearError,
  UserState,
} from '../userSlice';
import { User } from '@/types/auth';

describe('userSlice', () => {
  const initialState: UserState = {
    currentUser: null,
    isLoading: false,
    error: null,
  };

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'doctor',
    permissions: ['patients:read', 'patients:write'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  describe('Initial State', () => {
    it('should return initial state', () => {
      expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('initial state has correct structure', () => {
      const state = userReducer(undefined, { type: 'unknown' });
      expect(state).toHaveProperty('currentUser');
      expect(state).toHaveProperty('isLoading');
      expect(state).toHaveProperty('error');
    });

    it('initial currentUser is null', () => {
      const state = userReducer(undefined, { type: 'unknown' });
      expect(state.currentUser).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set current user', () => {
      const state = userReducer(initialState, setUser(mockUser));

      expect(state.currentUser).toEqual(mockUser);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should overwrite existing user', () => {
      const existingState: UserState = {
        ...initialState,
        currentUser: {
          ...mockUser,
          name: 'Old User',
        },
      };

      const newUser: User = {
        ...mockUser,
        name: 'New User',
      };

      const state = userReducer(existingState, setUser(newUser));

      expect(state.currentUser?.name).toBe('New User');
    });

    it('should clear errors when setting user', () => {
      const stateWithError: UserState = {
        ...initialState,
        error: 'Previous error',
      };

      const state = userReducer(stateWithError, setUser(mockUser));

      expect(state.error).toBeNull();
      expect(state.currentUser).toEqual(mockUser);
    });

    it('should set loading to false when setting user', () => {
      const loadingState: UserState = {
        ...initialState,
        isLoading: true,
      };

      const state = userReducer(loadingState, setUser(mockUser));

      expect(state.isLoading).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update specific user fields', () => {
      const stateWithUser: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      const updates: Partial<User> = {
        name: 'Updated Name',
      };

      const state = userReducer(stateWithUser, updateUser(updates));

      expect(state.currentUser?.name).toBe('Updated Name');
      expect(state.currentUser?.email).toBe(mockUser.email);
      expect(state.currentUser?.id).toBe(mockUser.id);
    });

    it('should update multiple fields at once', () => {
      const stateWithUser: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      const updates: Partial<User> = {
        name: 'New Name',
        email: 'newemail@example.com',
      };

      const state = userReducer(stateWithUser, updateUser(updates));

      expect(state.currentUser?.name).toBe('New Name');
      expect(state.currentUser?.email).toBe('newemail@example.com');
    });

    it('should not update if currentUser is null', () => {
      const state = userReducer(initialState, updateUser({ name: 'New Name' }));

      expect(state.currentUser).toBeNull();
    });

    it('should preserve unchanged fields', () => {
      const stateWithUser: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      const state = userReducer(stateWithUser, updateUser({ name: 'Updated' }));

      expect(state.currentUser?.email).toBe(mockUser.email);
      expect(state.currentUser?.role).toBe(mockUser.role);
      expect(state.currentUser?.permissions).toEqual(mockUser.permissions);
    });

    it('should update permissions array', () => {
      const stateWithUser: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      const newPermissions = ['patients:read', 'consultations:read'];
      const state = userReducer(stateWithUser, updateUser({ permissions: newPermissions }));

      expect(state.currentUser?.permissions).toEqual(newPermissions);
    });
  });

  describe('clearUser', () => {
    it('should clear current user', () => {
      const stateWithUser: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      const state = userReducer(stateWithUser, clearUser());

      expect(state.currentUser).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should clear user even if already null', () => {
      const state = userReducer(initialState, clearUser());

      expect(state.currentUser).toBeNull();
    });

    it('should clear errors when clearing user', () => {
      const stateWithError: UserState = {
        currentUser: mockUser,
        error: 'Some error',
        isLoading: false,
      };

      const state = userReducer(stateWithError, clearUser());

      expect(state.currentUser).toBeNull();
      expect(state.error).toBeNull();
    });

    it('should set loading to false when clearing user', () => {
      const loadingState: UserState = {
        currentUser: mockUser,
        isLoading: true,
        error: null,
      };

      const state = userReducer(loadingState, clearUser());

      expect(state.isLoading).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      const state = userReducer(initialState, setLoading(true));

      expect(state.isLoading).toBe(true);
    });

    it('should set loading to false', () => {
      const loadingState: UserState = {
        ...initialState,
        isLoading: true,
      };

      const state = userReducer(loadingState, setLoading(false));

      expect(state.isLoading).toBe(false);
    });

    it('should not affect other state when setting loading', () => {
      const stateWithUser: UserState = {
        currentUser: mockUser,
        isLoading: false,
        error: 'Error',
      };

      const state = userReducer(stateWithUser, setLoading(true));

      expect(state.isLoading).toBe(true);
      expect(state.currentUser).toEqual(mockUser);
      expect(state.error).toBe('Error');
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Failed to fetch user';
      const state = userReducer(initialState, setError(errorMessage));

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    it('should set loading to false when setting error', () => {
      const loadingState: UserState = {
        ...initialState,
        isLoading: true,
      };

      const state = userReducer(loadingState, setError('Error occurred'));

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Error occurred');
    });

    it('should overwrite existing error', () => {
      const stateWithError: UserState = {
        ...initialState,
        error: 'Old error',
      };

      const state = userReducer(stateWithError, setError('New error'));

      expect(state.error).toBe('New error');
    });

    it('should not affect currentUser when setting error', () => {
      const stateWithUser: UserState = {
        currentUser: mockUser,
        isLoading: false,
        error: null,
      };

      const state = userReducer(stateWithUser, setError('Error'));

      expect(state.currentUser).toEqual(mockUser);
      expect(state.error).toBe('Error');
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      const stateWithError: UserState = {
        ...initialState,
        error: 'Some error message',
      };

      const state = userReducer(stateWithError, clearError());

      expect(state.error).toBeNull();
    });

    it('should not affect other state when clearing error', () => {
      const stateWithError: UserState = {
        currentUser: mockUser,
        isLoading: true,
        error: 'Error',
      };

      const state = userReducer(stateWithError, clearError());

      expect(state.error).toBeNull();
      expect(state.currentUser).toEqual(mockUser);
      expect(state.isLoading).toBe(true);
    });
  });

  describe('Complex State Transitions', () => {
    it('should handle user fetch flow', () => {
      let state = initialState;

      // Set loading
      state = userReducer(state, setLoading(true));
      expect(state.isLoading).toBe(true);

      // Set user (success)
      state = userReducer(state, setUser(mockUser));
      expect(state.currentUser).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle user fetch error flow', () => {
      let state = initialState;

      // Set loading
      state = userReducer(state, setLoading(true));

      // Set error
      state = userReducer(state, setError('Failed to fetch'));
      expect(state.error).toBe('Failed to fetch');
      expect(state.isLoading).toBe(false);
      expect(state.currentUser).toBeNull();
    });

    it('should handle user update flow', () => {
      let state: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      // Update user
      state = userReducer(state, updateUser({ name: 'Updated Name' }));
      expect(state.currentUser?.name).toBe('Updated Name');

      // Update again
      state = userReducer(state, updateUser({ email: 'new@example.com' }));
      expect(state.currentUser?.name).toBe('Updated Name');
      expect(state.currentUser?.email).toBe('new@example.com');
    });

    it('should handle logout flow', () => {
      let state: UserState = {
        currentUser: mockUser,
        isLoading: false,
        error: null,
      };

      // Clear user
      state = userReducer(state, clearUser());
      expect(state.currentUser).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string error', () => {
      const state = userReducer(initialState, setError(''));
      expect(state.error).toBe('');
    });

    it('should handle updating user with empty object', () => {
      const stateWithUser: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      const state = userReducer(stateWithUser, updateUser({}));
      expect(state.currentUser).toEqual(mockUser);
    });

    it('should handle multiple consecutive user updates', () => {
      let state: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      state = userReducer(state, updateUser({ name: 'Name 1' }));
      state = userReducer(state, updateUser({ name: 'Name 2' }));
      state = userReducer(state, updateUser({ name: 'Name 3' }));

      expect(state.currentUser?.name).toBe('Name 3');
    });

    it('should handle rapid state changes', () => {
      let state = initialState;
      state = userReducer(state, setLoading(true));
      state = userReducer(state, setError('Error'));
      state = userReducer(state, clearError());
      state = userReducer(state, setUser(mockUser));
      state = userReducer(state, updateUser({ name: 'Updated' }));

      expect(state.currentUser?.name).toBe('Updated');
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should handle setting same user twice', () => {
      let state = userReducer(initialState, setUser(mockUser));
      state = userReducer(state, setUser(mockUser));

      expect(state.currentUser).toEqual(mockUser);
    });
  });

  describe('User Role and Permissions', () => {
    it('should update user role', () => {
      const stateWithUser: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      const state = userReducer(stateWithUser, updateUser({ role: 'admin' }));

      expect(state.currentUser?.role).toBe('admin');
    });

    it('should update user permissions', () => {
      const stateWithUser: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      const newPermissions = ['admin:all'];
      const state = userReducer(stateWithUser, updateUser({ permissions: newPermissions }));

      expect(state.currentUser?.permissions).toEqual(newPermissions);
    });

    it('should handle empty permissions array', () => {
      const stateWithUser: UserState = {
        ...initialState,
        currentUser: mockUser,
      };

      const state = userReducer(stateWithUser, updateUser({ permissions: [] }));

      expect(state.currentUser?.permissions).toEqual([]);
    });
  });
});
