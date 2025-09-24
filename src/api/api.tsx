// src/api/api.tsx

import { Product } from '@/types/product';

const API_BASE_URL = 'http://localhost:1209/api';

interface SaveProductResponse {
  id: string;
}

export const createProduct = async (
  productData: Partial<Product>,
  mainFiles: File[],
  variantFiles: { [key: number]: File[] }
): Promise<SaveProductResponse> => {
  try {
    const formData = new FormData();
    formData.append('data', JSON.stringify(productData));

    mainFiles.forEach((file) => {
      formData.append('mainImages', file);
    });

    Object.keys(variantFiles).forEach((variantIndex) => {
      variantFiles[parseInt(variantIndex, 10)].forEach((file) => {
        formData.append(`variantImages[${variantIndex}]`, file);
      });
    });

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  productData: Partial<Product>,
  mainFiles: File[],
  variantFiles: { [key: number]: File[] }
): Promise<SaveProductResponse> => {
  try {
    const formData = new FormData();
    formData.append('data', JSON.stringify(productData));

    mainFiles.forEach((file) => {
      formData.append('mainImages', file);
    });

    Object.keys(variantFiles).forEach((variantIndex) => {
      variantFiles[parseInt(variantIndex, 10)].forEach((file) => {
        formData.append(`variantImages[${variantIndex}]`, file);
      });
    });

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return an empty array on error
  }
};