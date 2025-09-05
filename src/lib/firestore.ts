'use client';
import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { Build, SubClass } from './types';

const buildsCollection = collection(db, 'builds');

// Get all builds with real-time updates
export function getBuilds(callback: (builds: Build[]) => void) {
  return onSnapshot(buildsCollection, (snapshot) => {
    const builds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Build));
    callback(builds);
  });
}

// Get a single build by class name (not real-time, as it's for single page loads)
export async function getBuildByClassName(className: string): Promise<Build | null> {
    const docRef = doc(db, 'builds', className);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return { id: docSnap.id, ...docSnap.data() } as Build;
}

// Create a new build or add a new subclass to an existing build
export async function createOrUpdateBuild(className: string, subClassData: Omit<SubClass, 'id'>) {
    const buildDocRef = doc(db, 'builds', className);
    const docSnap = await getDoc(buildDocRef);

    if (docSnap.exists()) {
        // Build for this class exists, add new subclass
        await updateDoc(buildDocRef, {
            subclasses: arrayUnion(subClassData)
        });
    } else {
        // No build for this class, create a new one with the className as ID
        await setDoc(buildDocRef, {
            class: className,
            subclasses: [subClassData]
        });
    }
}

// Update a specific category within a subclass
export async function updateBuild(className: string, subClassName: string, data: Partial<SubClass>) {
    const buildDocRef = doc(db, 'builds', className);
    const docSnap = await getDoc(buildDocRef);

    if (!docSnap.exists()) {
        throw new Error("Build não encontrada!");
    }

    const existingBuild = docSnap.data() as Omit<Build, 'id'>;

    const newSubclasses = existingBuild.subclasses.map(sc => {
        if (sc.name === subClassName) {
            // Merge existing data with new data
            return { ...sc, ...data };
        }
        return sc;
    });

    await updateDoc(buildDocRef, { subclasses: newSubclasses });
}
