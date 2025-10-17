/**
 * Medical Conditions Loader Component
 * Fetches medical conditions on app initialization and caches them in Redux
 */

'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchMedicalConditions,
  selectMedicalConditions,
  selectMedicalConditionsLastFetched,
} from '@/store/slices/medicalConditionsSlice';

/**
 * Component that fetches medical conditions on mount
 * Only fetches if data hasn't been loaded yet
 * Runs silently in the background without UI
 */
export const MedicalConditionsLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const conditions = useAppSelector(selectMedicalConditions);
  const lastFetched = useAppSelector(selectMedicalConditionsLastFetched);

  useEffect(() => {
    // Only fetch if we don't have data yet
    // Check if conditions are empty or if data is stale (older than 24 hours)
    const isStale = lastFetched ? Date.now() - lastFetched > 24 * 60 * 60 * 1000 : true;

    if (conditions.length === 0 || isStale) {
      dispatch(fetchMedicalConditions());
    }
  }, [dispatch, conditions.length, lastFetched]);

  // This component doesn't render anything
  return null;
};
