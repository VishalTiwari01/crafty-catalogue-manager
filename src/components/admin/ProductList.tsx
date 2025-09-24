// src/components/admin/ProductList.tsx

import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Search, 
  Star,
  DollarSign,
  Package
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductList = ({ products, onEdit, onDelete }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredProducts = products.filter(product =>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, id) => (
          // Added the 'key' prop here
          <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
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
                <Badge variant="secondary" className="absolute top-2 left-2">Featured</Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onEdit(product)}>
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDelete(product)}>
                      <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="text-xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
                {product.salePrice > 0 && (
                  <p className="text-sm text-muted-foreground line-through ml-2">
                    ${product.salePrice.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm mt-2 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{product.rating} ({product.reviewCount})</span>
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
          </p>
        </div>
      )}
    </div>
  );
};