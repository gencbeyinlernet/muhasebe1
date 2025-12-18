
export type Category = 'Tümü' | 'Metin' | 'Görsel' | 'Video' | 'Ses' | 'Kodlama' | 'Eğitim' | 'Araştırma' | 'Matematik' | 'Verimlilik';

export interface AITool {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: Category;
  url: string;
  imageUrl: string;
  isPopular?: boolean;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  fieldOfWork: string;
  isRegistered: boolean;
}