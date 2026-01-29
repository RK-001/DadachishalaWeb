import { useState, useCallback } from 'react';

/**
 * Custom hook for CRUD operations with loading and error states
 * @param {string} resourceName - Name of the resource (e.g., 'blogs', 'events')
 * @param {Function} createFn - Function to create a new item
 * @param {Function} updateFn - Function to update an existing item
 * @param {Function} deleteFn - Function to delete an item
 * @param {Function} refetch - Function to refetch data after operations
 * @returns {Object} - CRUD operation handlers with loading/error states
 */
export const useCRUD = (resourceName, createFn, updateFn, deleteFn, refetch) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeOperation = useCallback(async (operation, successMessage) => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      setLoading(false);
      
      if (refetch) {
        await refetch();
      }
      
      return { success: true, data: result };
    } catch (err) {
      console.error(`${resourceName} operation error:`, err);
      setError(err.message || 'An error occurred');
      setLoading(false);
      
      return { success: false, error: err.message };
    }
  }, [resourceName, refetch]);

  const create = useCallback(async (data) => {
    return executeOperation(() => createFn(data), 'Created successfully');
  }, [executeOperation, createFn]);

  const read = useCallback(async () => {
    return executeOperation(createFn);
  }, [executeOperation, createFn]);

  const update = useCallback(async (id, data) => {
    return executeOperation(() => updateFn(id, data), 'Updated successfully');
  }, [executeOperation, updateFn]);

  const remove = useCallback(async (id) => {
    return executeOperation(() => deleteFn(id), 'Deleted successfully');
  }, [executeOperation, deleteFn]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    create,
    read,
    update,
    remove,
    delete: remove, // Alias for remove
    resetError,
    executeOperation
  };
};

export default useCRUD;
