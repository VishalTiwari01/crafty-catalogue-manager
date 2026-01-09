// src/types/product.ts

export interface ApiVariant {
  id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  quantity: number;
  image?: {
    src: string;
  };
}

export interface Product {
  id: number;
  title: string;
  body_html: string;
  product_type: string;
  status: "active" | "draft";
  variants: ApiVariant[];
  vendor?: string;
  image?: {
    src: string;
  };
}