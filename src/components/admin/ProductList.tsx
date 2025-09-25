import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  DollarSign,
  Package,
  Edit2,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductList = ({ products, onEdit, onDelete }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product.id);
      toast({
        title: "Product Deleted",
        description: `${product.name} has been removed.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id ?? `${product.name}-${product.price}`} // ✅ Unique key fallback
            className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 relative"
          >
            {/* Product Image */}
            <div className="relative">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-400">
                  No Image
                </div>
              )}
              {product.isFeatured && (
                <Badge variant="secondary" className="absolute top-2 left-2">
                  Featured
                </Badge>
              )}

              {/* Edit & Delete Icons */}
              <div className="absolute top-2 right-2 flex space-x-2 bg-white/80 p-1 rounded-md shadow-sm">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-blue-600 hover:bg-blue-100"
                  onClick={() => onEdit(product)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-100"
                  onClick={() => handleDelete(product)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <CardContent className="p-4">
              <div className="mb-1">
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xl font-bold text-primary">
                  ₹{product.price.toFixed(2)}
                </p>
                {product.salePrice > 0 && (
                  <p className="text-sm text-muted-foreground line-through ml-2">
                    ₹{product.salePrice.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Ratings & Stock */}
              <div className="flex items-center justify-between text-sm mt-2 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package className="w-4 h-4" />
                  <span>{product.stockQuantity} in stock</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding your first product."}
          </p>
        </div>
      )}
    </div>
  );
};
