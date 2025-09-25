// src/types/product.d.ts

export interface ProductVariant {
  productId?: string;
  variantType: string;
  variantValue: string;
  priceAdjustment: number;
  stockQuantity: number;
  images: string[]; // Updated to an array of image URLs
  isActive: boolean;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  weight?: number;
  size?: string;
  careInstructions?: string;
  warrantyPeriod?: number;
  isFeatured: boolean;
  isActive: boolean;
  status: 'active' | 'draft' | 'archived';
  variants: ProductVariant[];
  // images: string[]; // URLs for the main product images
  slug?: string;
}