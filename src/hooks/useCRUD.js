import { useState, useCallback } from 'react';

/**
 * Custom hook for CRUD operations with loading and error states.
 * Reads should be handled by React Query hooks (useFirebaseQueries.js).
 * This hook is intended solely for create / update / delete side-effects.
 *
 * @param {string} resourceName - Name of the resource (e.g., 'blogs', 'events')
 * @param {Function} createFn - Function to create a new item
 * @param {Function} updateFn - Function to update an existing item
 * @param {Function} deleteFn - Function to delete an item
 * @param {Function} [refetch] - Optional React Query refetch to call after mutations
 * @returns {Object} - CRUD operation handlers with loading/error states
 */
export const useCRUD = (resourceName, createFn, updateFn, deleteFn, refetch) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeOperation = useCallback(async (operation) => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      if (refetch) await refetch();
      return { success: true, data: result };
    } catch (err) {
      console.error(`${resourceName} operation error:`, err);
      setError(err.message || 'An error occurred');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [resourceName, refetch]);

  const create = useCallback(
    (data) => executeOperation(() => createFn(data)),
    [executeOperation, createFn]
  );

  const update = useCallback(
    (id, data) => executeOperation(() => updateFn(id, data)),
    [executeOperation, updateFn]
  );

  const remove = useCallback(
    (id) => executeOperation(() => deleteFn(id)),
    [executeOperation, deleteFn]
  );

  const resetError = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    create,
    update,
    remove,
    delete: remove,
    resetError,
    executeOperation,
  };
};

export default useCRUD;
