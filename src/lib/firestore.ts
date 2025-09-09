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
import { Build, SubClass, PropertyPage } from './types';

const buildsCollection = collection(db, 'builds');

// Get all builds with real-time updates
export function getBuilds(callback: (builds: Build[]) => void) {
  return onSnapshot(buildsCollection, (snapshot) => {
    const builds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Build));
    callback(builds);
  });
}

// Get all builds for a specific class with real-time updates
export function getBuildsByClass(className: string, callback: (builds: Build[]) => void) {
  const q = query(buildsCollection, where('class', '==', className));
  return onSnapshot(q, (snapshot) => {
    const builds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Build));
    callback(builds);
  });
}

// Get a single build by its ID (which is the custom build name)
export async function getBuildByClassName(className: string): Promise<Build | null> {
    const docRef = doc(db, 'builds', className);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return { id: docSnap.id, ...docSnap.data() } as Build;
}

// Create a new build or add a new subclass to an existing build
export async function createOrUpdateBuild(buildName: string, data: { class: string; name: string, skills: any[], properties: PropertyPage[] }) {
    const buildDocRef = doc(db, 'builds', buildName);
    const docSnap = await getDoc(buildDocRef);

    const subClassData: SubClass = {
        name: data.name,
        runes: [],
        skills: data.skills || [],
        properties: data.properties || [],
        config: [],
        constellation: [],
        sets: [],
    };

    if (docSnap.exists()) {
        // Build for this class exists, add new subclass
        await updateDoc(buildDocRef, {
            subclasses: arrayUnion(subClassData)
        });
    } else {
        // No build for this class, create a new one with the buildName as ID
        await setDoc(buildDocRef, {
            class: data.class,
            subclasses: [subClassData]
        });
    }
}

// Update a specific category within a subclass
export async function updateBuild(buildId: string, subClassName: string, data: Partial<Omit<SubClass, 'name'>>) {
    const buildDocRef = doc(db, 'builds', buildId);
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
