import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Custom hook to subscribe to a Firestore collection with real-time updates
 * @param {string} collectionName - Name of the Firestore collection
 * @param {Array} queryConstraints - Array of query constraints (orderBy, where, etc.)
 * @returns {Object} - { data, loading, error }
 */
export const useFirestoreCollection = (collectionName, queryConstraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) {
      setLoading(false);
      return;
    }

    try {
      const collectionRef = collection(db, collectionName);
      const q = queryConstraints.length > 0 
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(`Error fetching ${collectionName}:`, err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up listener for ${collectionName}:`, err);
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(queryConstraints)]);

  return { data, loading, error };
};

/**
 * Custom hook to subscribe to a single Firestore document
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} documentId - ID of the document
 * @returns {Object} - { data, loading, error }
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

    try {
      const docRef = doc(db, collectionName, documentId);

      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setData({ id: snapshot.id, ...snapshot.data() });
          } else {
            setData(null);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(`Error fetching document ${documentId} from ${collectionName}:`, err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up listener for document ${documentId}:`, err);
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName, documentId]);

  return { data, loading, error };
};

export default useFirestoreCollection;
