import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Typed Hooks for Redux Store
 *
 * These hooks provide type-safe access to the Redux store
 * Use these throughout your app instead of plain `useDispatch` and `useSelector`
 */

/**
 * Use throughout your app instead of plain `useDispatch`
 * Provides type safety for dispatching actions
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(setUser(userData));
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Use throughout your app instead of plain `useSelector`
 * Provides type safety for selecting state
 *
 * @example
 * const user = useAppSelector((state) => state.user.currentUser);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
