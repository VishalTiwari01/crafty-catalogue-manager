import { useState } from "react";
import { Product } from "@/types/product";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductList } from "@/components/admin/ProductList";
import { ProductForm } from "@/components/admin/ProductForm";

// Sample data to get started
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Art & Craft Set',
    price: 32.99,
    originalPrice: 42.99,
    rating: 4.8,
    reviewCount: 89,
    category: 'Arts & Crafts',
    emoji: '🎨',
    colors: ['#E74C3C', '#F39C12', '#2ECC71', '#9B59B6'],
    colorNames: ['Creative Red', 'Artistic Orange', 'Nature Green', 'Imagination Purple'],
    images: ['🎨', '✏️', '📝', '🌈'],
    description: 'Unleash your child\'s artistic potential with this comprehensive art set! Includes crayons, markers, colored pencils, paper, and more for endless creativity.',
    features: [
      '64-piece complete art set',
      'Non-toxic materials',
      'Organized carrying case',
      'Perfect for travel',
      'Encourages creativity'
    ],
    specifications: {
      'Age Range': '4-12 years',
      'Material': 'Non-toxic art supplies',
      'Pieces': '64 items',
      'Weight': '2.3 lbs',
      'Dimensions': '13" x 10" x 3"'
    },
    ageRange: '4-12'
  },
  {
    id: 2,
    name: 'Building Blocks Pro',
    price: 45.99,
    originalPrice: 55.99,
    rating: 4.9,
    reviewCount: 156,
    category: 'Building & Construction',
    emoji: '🧱',
    colors: ['#3498DB', '#E74C3C', '#F1C40F', '#2ECC71'],
    colorNames: ['Ocean Blue', 'Fire Red', 'Sunshine Yellow', 'Forest Green'],
    images: ['🧱', '🏗️', '🏰', '🚧'],
    description: 'Premium building blocks set with 200+ pieces for endless construction possibilities. Compatible with major brands and includes instruction booklet.',
    features: [
      '200+ premium blocks',
      'Compatible with major brands',
      'Instruction booklet included',
      'Durable plastic construction',
      'Develops spatial thinking'
    ],
    specifications: {
      'Age Range': '6-16 years',
      'Material': 'ABS Plastic',
      'Pieces': '205 blocks',
      'Weight': '3.1 lbs',
      'Dimensions': '15" x 12" x 4"'
    },
    ageRange: '6-16'
  }
];

const Admin = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: Math.max(...products.map(p => p.id), 0) + 1
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
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
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default Admin;