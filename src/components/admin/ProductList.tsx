import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductListProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onView?: (product: any) => void;
}

const formatPrice = (value?: number | null) =>
  typeof value === "number" ? value.toFixed(2) : "0.00";

export const ProductList = ({
  products,
  onEdit,
  onDelete,
  onView,
}: ProductListProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const firstVariant = product.variants?.[0];

        const stock = product.variants?.reduce(
          (sum: number, v: any) => sum + (v.stockQuantity ?? 0),
          0
        );

        const imageSrc =
          product.images?.[0]?.imageUrl ||
          firstVariant?.images?.[0]?.imageUrl ||
          "https://via.placeholder.com/100?text=No+Image";

        return (
          <div
            key={product._id}
            className="group flex gap-4 p-4 border rounded-xl bg-background hover:shadow-md transition"
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={imageSrc}
                alt={product.name}
                className="h-24 w-24 rounded-lg object-cover border"
              />
              {stock === 0 && (
                <span className="absolute top-1 left-1 text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                  Out of stock
                </span>
              )}
            </div>

            {/* INFO */}
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-lg leading-tight">
                {product.name}
              </h3>

              <p className="text-xs text-muted-foreground">
                Category: {product.categoryId}
              </p>

              {/* PRICE */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">
                  ₹{formatPrice(firstVariant?.salePrice ?? firstVariant?.price)}
                </span>

                {firstVariant?.salePrice && (
                  <span className="text-xs line-through text-muted-foreground">
                    ₹{formatPrice(firstVariant.price)}
                  </span>
                )}
              </div>

              {/* META */}
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Stock: {stock}</span>
                <span>Variants: {product.variants?.length ?? 0}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col justify-between items-end gap-2">
              <div className="flex gap-2">
                
                  <button
                    onClick={() => onView(product._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg hover:bg-muted transition"
                  >
                    <Eye size={14} />
                    View
                  </button>
                

                <button
                  onClick={() => onEdit(product)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  <Pencil size={14} />
                  Edit
                </button>

                <button
                  onClick={() => onDelete(product.shiprocketProductId)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {products.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No products found
        </div>
      )}
    </div>
  );
};