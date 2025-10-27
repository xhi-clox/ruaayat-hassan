'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  type Firestore,
  type CollectionReference,
  type DocumentData,
  type Query,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseCollectionOptions {
  where?: [string, '==', any];
  orderBy?: [string, 'asc' | 'desc'];
  limit?: number;
  startAfter?: any;
  endBefore?: any;
}

export function useCollection<T extends DocumentData>(
  path: string | null, // Allow path to be null
  options?: UseCollectionOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If path is null, don't do anything. Reset state.
    if (!firestore || !path) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    let colRef: Query = collection(firestore, path);

    if (options?.where) {
      colRef = query(colRef, where(...options.where));
    }
    if (options?.orderBy) {
      colRef = query(colRef, orderBy(...options.orderBy));
    }
    if (options?.startAfter) {
      colRef = query(colRef, startAfter(options.startAfter));
    }
    if (options?.endBefore) {
      colRef = query(colRef, endBefore(options.endBefore));
    }
    if (options?.limit) {
      if (options.endBefore) {
         colRef = query(colRef, limitToLast(options.limit));
      } else {
         colRef = query(colRef, limit(options.limit));
      }
    }

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, JSON.stringify(options)]);

  return { data, loading, error };
}
