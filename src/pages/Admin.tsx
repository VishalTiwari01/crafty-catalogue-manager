// src/Admin.tsx

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductList } from "@/components/admin/ProductList";
import { ProductForm } from "@/components/admin/ProductForm";
import { useToast } from "@/hooks/use-toast";
import { createProduct, updateProduct, deleteProduct, fetchProducts } from "@/api/api"; // Updated import

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const { toast } = useToast();

  // Fetch products on initial load
  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };
    getProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Modified to handle API calls and file uploads
  const handleSaveProduct = async (
    productData: Product,
    mainFiles: File[],
    variantFiles: { [key: number]: File[] }
  ) => {
    try {
      if (productData.id) {
        await updateProduct(productData.id, productData, mainFiles, variantFiles);
        toast({
          title: "Product Updated",
          description: `${productData.name} has been successfully updated.`,
        });
      } else {
        await createProduct(productData, mainFiles, variantFiles);
        toast({
          title: "Product Created",
          description: `${productData.name} has been successfully created.`,
        });
      }
      // Re-fetch products to update the list
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setShowForm(false);
      setEditingProduct(undefined);
    } catch (error) {
      
    }
  };

  // Modified to handle API call
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast({
        title: "Product Deleted",
        description: `The product has been removed from the catalog.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete product. Please try again.`,
        variant: 'destructive'
      });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onAddProduct={handleAddProduct} />
      
      <main className="container mx-auto px-6 py-8">
        <ProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </main>

      {showForm && (
        <ProductForm
          product={editingProduct}
          // onSave={handleSaveProduct}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default Admin;