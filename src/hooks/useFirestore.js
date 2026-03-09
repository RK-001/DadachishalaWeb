import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { queryClient } from '../config/queryClient';

/**
 * Subscribe to a Firestore collection with real-time updates via onSnapshot.
 * Intended for admin panels that need live data without manual refresh.
 *
 * When `syncQueryKey` is provided, every snapshot update is also written into
 * the React Query cache so public-facing hooks (useFirebaseQueries) see the
 * same data without waiting for their staleTime to expire.
 *
 * @param {string}   collectionName      - Firestore collection name
 * @param {Array}    [queryConstraints]  - Array of Firestore query constraints
 *                                         (orderBy, where, limit, …).
 *                                         Passing a non-array value is safe and ignored.
 * @param {Array}    [syncQueryKey]      - Optional React Query key to keep in sync
 *                                         e.g. [QUERY_KEYS.events]
 * @returns {{ data: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export const useFirestoreCollection = (
  collectionName,
  queryConstraints = [],
  syncQueryKey = null
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Increment to force re-subscription (used by refetch)
  const [epoch, setEpoch] = useState(0);

  // Safely normalise constraints — callers like BlogManagement pass a Function by mistake
  const safeConstraints = Array.isArray(queryConstraints) ? queryConstraints : [];

  // Serialise constraints so useEffect deps work with plain objects/values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const constraintsKey = JSON.stringify(safeConstraints);

  const syncQueryKeyRef = useRef(syncQueryKey);
  syncQueryKeyRef.current = syncQueryKey;

  useEffect(() => {
    if (!collectionName) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const collectionRef = collection(db, collectionName);
      const q = safeConstraints.length > 0
        ? query(collectionRef, ...safeConstraints)
        : collectionRef;

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setData(items);
          setLoading(false);
          setError(null);

          // Keep React Query cache in sync so public pages don't serve stale data
          if (syncQueryKeyRef.current) {
            queryClient.setQueryData(syncQueryKeyRef.current, items);
          }
        },
        (err) => {
          console.error(`[useFirestoreCollection] ${collectionName}:`, err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`[useFirestoreCollection] setup error for ${collectionName}:`, err);
      setError(err.message);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, constraintsKey, epoch]);

  /** Force a re-subscription (rebuilds the onSnapshot listener) */
  const refetch = useCallback(() => setEpoch(e => e + 1), []);

  return { data, loading, error, refetch };
};

/**
 * Subscribe to a single Firestore document with real-time updates.
 *
 * @param {string} collectionName - Firestore collection name
 * @param {string} documentId     - Document ID
 * @returns {{ data: Object|null, loading: boolean, error: string|null }}
 */
export const useFirestoreDocument = (collectionName, documentId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName || !documentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, documentId);

      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          setData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(`[useFirestoreDocument] ${collectionName}/${documentId}:`, err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`[useFirestoreDocument] setup error for ${collectionName}/${documentId}:`, err);
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName, documentId]);

  return { data, loading, error };
};

export default useFirestoreCollection;

