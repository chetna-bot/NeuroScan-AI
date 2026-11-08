/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AnalysisResult } from '../types/analysis';

// Initialize Firebase App & Services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection Test as required by skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[NeuroScan AI] Firestore client is offline. Verify network connection.');
    }
    return false;
  }
}

// Structured error handling interface from Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth Helpers
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  // Ensure user profile document exists
  if (result.user) {
    const userRef = doc(db, 'users', result.user.uid);
    await setDoc(
      userRef,
      {
        userId: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || 'Researcher',
        photoURL: result.user.photoURL || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch(() => {});
  }
  return result.user;
}

export async function registerWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  const userRef = doc(db, 'users', result.user.uid);
  await setDoc(userRef, {
    userId: result.user.uid,
    email: result.user.email || email,
    displayName: displayName || 'Researcher',
    photoURL: '',
    createdAt: new Date().toISOString(),
  }).catch(() => {});
  return result.user;
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Save Analysis to User's Firestore Subcollection
export async function saveAnalysisToUserFirestore(
  userId: string,
  analysis: AnalysisResult
): Promise<void> {
  const path = `users/${userId}/analyses/${analysis.id}`;
  try {
    const analysisDocRef = doc(db, 'users', userId, 'analyses', analysis.id);
    await setDoc(analysisDocRef, {
      id: analysis.id,
      userId,
      filename: analysis.filename,
      timestamp: analysis.timestamp,
      predicted_class: analysis.predicted_class,
      confidence: analysis.confidence,
      probabilities: analysis.probabilities,
      segmentation_mask: analysis.segmentation_mask,
      gradcam_image: analysis.gradcam_image,
      originalImage: analysis.originalImage,
      createdAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Delete Analysis
export async function deleteAnalysisFromUserFirestore(
  userId: string,
  analysisId: string
): Promise<void> {
  const path = `users/${userId}/analyses/${analysisId}`;
  try {
    const analysisDocRef = doc(db, 'users', userId, 'analyses', analysisId);
    await deleteDoc(analysisDocRef);
  } catch (err: unknown) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Subscribe to User's Analyses in Realtime
export function subscribeToUserAnalyses(
  userId: string,
  onData: (analyses: AnalysisResult[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `users/${userId}/analyses`;
  const q = query(collection(db, 'users', userId, 'analyses'), orderBy('timestamp', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: AnalysisResult[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        items.push({
          id: d.id || docSnap.id,
          timestamp: d.timestamp || new Date().toISOString(),
          filename: d.filename || 'mri_scan.jpg',
          originalImage: d.originalImage || '',
          predicted_class: d.predicted_class || 'Unknown',
          confidence: d.confidence || 0,
          probabilities: d.probabilities || {
            Glioma: 0,
            Meningioma: 0,
            'No Tumor': 0,
            Pituitary: 0,
          },
          segmentation_mask: d.segmentation_mask || '',
          gradcam_image: d.gradcam_image || '',
        });
      });
      onData(items);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (formattedErr) {
        if (onError && formattedErr instanceof Error) {
          onError(formattedErr);
        }
      }
    }
  );
}
