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
    const q = query(buildsCollection, where("class", "==", className));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Build;
}

// Create a new build or add a new subclass to an existing build
export async function createOrUpdateBuild(className: string, subClassData: Omit<SubClass, 'id'>) {
    const existingBuild = await getBuildByClassName(className);

    if (existingBuild) {
        // Build for this class exists, add new subclass
        const buildDoc = doc(db, 'builds', existingBuild.id);
        await updateDoc(buildDoc, {
            subclasses: arrayUnion(subClassData)
        });
    } else {
        // No build for this class, create a new one
        const newBuildDoc = doc(buildsCollection);
        await setDoc(newBuildDoc, {
            class: className,
            subclasses: [subClassData]
        });
    }
}

// Update a specific category within a subclass
export async function updateBuild(buildId: string, subClassName: string, data: Partial<SubClass>) {
    const buildDocRef = doc(db, 'builds', buildId);
    const existingBuild = (await getDocs(query(buildsCollection, where('__name__', '==', buildId)))).docs[0].data() as Omit<Build, 'id'>;

    if (!existingBuild) {
        throw new Error("Build não encontrada!");
    }

    const newSubclasses = existingBuild.subclasses.map(sc => {
        if (sc.name === subClassName) {
            // Merge existing data with new data
            return { ...sc, ...data };
        }
        return sc;
    });

    await updateDoc(buildDocRef, { subclasses: newSubclasses });
}
