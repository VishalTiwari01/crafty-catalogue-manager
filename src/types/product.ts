export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  emoji: string;
  colors: string[];
  colorNames: string[];
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  ageRange: string;
}