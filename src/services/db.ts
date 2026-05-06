import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, serverTimestamp, Timestamp, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Category, Photo } from "../types";
import { OperationType, handleFirestoreError } from "../lib/firestore-errors";

function toDateString(timestamp: any): string {
  if (!timestamp) return new Date().toISOString();
  if (timestamp.toDate) return timestamp.toDate().toISOString();
  if (typeof timestamp === 'string') return timestamp;
  return new Date().toISOString();
}

export const dbService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const p = 'categories';
    try {
      const q = query(collection(db, p), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDateString(doc.data().createdAt),
        updatedAt: toDateString(doc.data().updatedAt),
      })) as Category[];
    } catch (e) {
      return handleFirestoreError(e, OperationType.LIST, p) as any;
    }
  },

  subscribeToCategories(onData: (categories: Category[]) => void) {
    const p = 'categories';
    const q = query(collection(db, p), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDateString(doc.data().createdAt),
        updatedAt: toDateString(doc.data().updatedAt),
      })) as Category[];
      onData(cats);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, p);
    });
  },

  async createCategory(id: string, name: string, icon: string): Promise<void> {
    const p = `categories/${id}`;
    try {
      await setDoc(doc(db, 'categories', id), {
        name,
        icon,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, p);
    }
  },

  async updateCategory(id: string, name: string, icon: string): Promise<void> {
    const p = `categories/${id}`;
    try {
      // Need to preserve createdAt timestamp. So we must get it first if we are doing setDoc with merge or just updateDoc
      // But updateDoc will fail if we don't pass all fields if our rule uses hasOnly? Actually rules check affectedKeys().
      const docRef = doc(db, 'categories', id);
      await setDoc(docRef, {
        name,
        icon,
        updatedAt: serverTimestamp(),
      }, { merge: true }); // Merge true works with partial updates in firestore
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, p);
    }
  },

  async deleteCategory(id: string): Promise<void> {
    const p = `categories/${id}`;
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, p);
    }
  },

  // Photos
  async getPhotos(): Promise<Photo[]> {
     const p = 'photos';
    try {
      const q = query(collection(db, p), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDateString(doc.data().createdAt),
        updatedAt: toDateString(doc.data().updatedAt),
      })) as Photo[];
    } catch (e) {
      return handleFirestoreError(e, OperationType.LIST, p) as any;
    }
  },

  subscribeToPhotos(onData: (photos: Photo[]) => void) {
    const p = 'photos';
    const q = query(collection(db, p), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const ph = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toDateString(doc.data().createdAt),
        updatedAt: toDateString(doc.data().updatedAt),
      })) as Photo[];
      onData(ph);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, p);
    });
  },

  async createPhoto(id: string, photo: Omit<Photo, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const p = `photos/${id}`;
    try {
       await setDoc(doc(db, 'photos', id), {
        ...photo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, p);
    }
  },

  async updatePhoto(id: string, photo: Partial<Omit<Photo, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const p = `photos/${id}`;
    try {
      await setDoc(doc(db, 'photos', id), {
        ...photo,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, p);
    }
  },

  async deletePhoto(id: string): Promise<void> {
    const p = `photos/${id}`;
    try {
       await deleteDoc(doc(db, 'photos', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, p);
    }
  }
};
