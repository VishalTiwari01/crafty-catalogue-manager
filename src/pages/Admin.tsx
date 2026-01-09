// src/Admin.tsx

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductList } from "@/components/admin/ProductList";
import { ProductForm } from "@/components/admin/ProductForm";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
} from "@/api/api";
import axios from "axios";

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProducts(
          debouncedSearch,
          page,
          limit
        );
        setProducts(fetchedProducts);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [debouncedSearch, page, limit]);

  /* ---------------- HANDLERS ---------------- */
  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast({
        title: "Product Deleted",
        description: "Product removed successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const handleOnView = async (id: string) => {

    navigate(`/admin/products/${id}`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader onAddProduct={handleAddProduct} />

      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* ---------------- SEARCH BAR ---------------- */}
        <div className="bg-background rounded-xl shadow-sm border p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              disabled={loading}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:text-gray-100 dark:bg-gray-800"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Rows per page
            </span>
            <select
              value={limit}
              disabled={loading}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary disabled:opacity-50 dark:text-gray-100 dark:bg-gray-800"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* ---------------- PRODUCT LIST ---------------- */}
        <div className="bg-background rounded-xl shadow-sm border ">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Loading products...
            </div>
          ) : (
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onView={handleOnView}
            />
          )}
        </div>

        {/* ---------------- PAGINATION ---------------- */}
        <div className="flex items-center justify-between bg-background rounded-xl shadow-sm border p-4">
          <span className="text-sm text-muted-foreground">
            Page <strong>{page}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-muted disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading || products.length < limit}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-muted disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* ---------------- PRODUCT FORM MODAL ---------------- */}
      {showForm && (
        <ProductForm
          product={editingProduct}

          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default Admin;