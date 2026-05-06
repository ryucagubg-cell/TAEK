export interface Category {
  id: string; // The firestore document ID
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string; // The firestore document ID
  title: string;
  description: string;
  drive_id: string;
  category_id: string;
  createdAt: string;
  updatedAt: string;
}
