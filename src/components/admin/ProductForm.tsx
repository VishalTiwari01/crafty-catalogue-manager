// src/components/ProductForm.tsx

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductVariant {
  variantType: string;
  variantValue: string;
  priceAdjustment: number;
  stockQuantity: number;
  imageUrl: {
    public_id: string;
    imageUrl: string;
  };
  isActive: boolean;
}

interface ProductFormData {
  name: string;
  slug?: string;
  description: string;
  shortDescription: string;
  sku?: string;
  categoryId: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  weight: number;
  dimensions?: string;
  material?: string;
  color?: string;
  size: string;
  careInstructions?: string;
  warrantyPeriod: number;
  isFeatured: boolean;
  isActive: boolean;
  imageUrl: {
    public_id: string;
    imageUrl: string;
  };
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';
  metaTitle?: string;
  metaDescription?: string;
  variants: ProductVariant[];
}

interface ProductFormProps {
  product?: ProductFormData;
  onSave?: (product: ProductFormData) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
  
  // Main form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    sku: '',
    categoryId: '',
    price: 0,
    salePrice: 0,
    costPrice: 0,
    stockQuantity: 0,
    lowStockThreshold: 0,
    weight: 0,
    dimensions: '',
    material: '',
    color: '',
    size: '',
    careInstructions: '',
    warrantyPeriod: 0,
    isFeatured: false,
    isActive: true,
    imageUrl: {
      public_id: '',
      imageUrl: ''
    },
    status: 'active',
    metaTitle: '',
    metaDescription: '',
    variants: [],
  });

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState<number | null>(null);

  // Image preview states
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [variantPreviews, setVariantPreviews] = useState<{ [key: number]: string }>({});

  // API base URL - adjust according to your setup
  const API_BASE_URL = 'http://localhost:1209/api';

  useEffect(() => {
    if (product) {
      setFormData(product);
      // Set existing image preview
      if (product.imageUrl && product.imageUrl.imageUrl) {
        setMainImagePreview(product.imageUrl.imageUrl);
      }
      // Set variant image previews
      const initialVariantPreviews: { [key: number]: string } = {};
      product?.variants?.forEach((variant, index) => {
        if (variant.imageUrl && variant.imageUrl.imageUrl) {
          initialVariantPreviews[index] = variant.imageUrl.imageUrl;
        }
      });
      setVariantPreviews(initialVariantPreviews);
    }
  }, [product]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle main field changes
  const handleMainFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => {
      const updated = {
        ...prev,
        [id]: type === 'checkbox' ? checked : value,
      };
      
      // Auto-generate slug when name changes
      if (id === 'name' && value) {
        updated.slug = generateSlug(value);
        // Auto-generate SKU if empty
        if (!prev.sku) {
          updated.sku = generateSlug(value).toUpperCase().replace(/-/g, '-') + '-001';
        }
      }
      
      return updated;
    });
  };

  const handleNumberFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: parseFloat(value) || 0,
    }));
  };

  // Upload multiple images to your API - COMMENTED OUT FOR TESTING
  // const uploadImages = async (files: File[]): Promise<Array<{ url: string; public_id: string }>> => {
  //  asdsf const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append('image', file);
  //   });

  //   const response = await fetch(`${API_BASE_URL}/uploads/images`, {
  //     method: 'POST',
  //     body: formData,
  //   });

  //   if (!response.ok) {
  //     throw new Error(`Upload failed: ${response.statusText}`);
  //   }

  //   const result = await response.json();
  //   return result.images; // Assuming API returns { images: [{ url, public_id }] }
  // };

  // Demo function for testing - returns mock image data
  const uploadImages = async (files: File[]): Promise<Array<{ url: string; public_id: string }>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return demo image data for each file
    return files.map((file, index) => ({
      url: `https://picsum.photos/400/400?random=${Date.now()}-${index}`,
      public_id: `demo_image_${Date.now()}_${index}`
    }));
  };

  // Handle main image upload
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      const uploadedImages = await uploadImages(fileArray);

      // Use only the first uploaded image (single image per interface)
      const firstImage = uploadedImages[0];
      const imageObject = {
        imageUrl: firstImage.url,
        public_id: firstImage.public_id,
      };

      setFormData(prev => ({
        ...prev,
        imageUrl: imageObject
      }));

      // Set preview
      setMainImagePreview(firstImage.url);

      toast({
        title: 'Success',
        description: 'Image uploaded successfully.',
      });
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Remove main image
  const removeMainImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: {
        public_id: '',
        imageUrl: ''
      }
    }));
    setMainImagePreview('');
  };

  // Handle variant image upload
  const handleVariantImageChange = async (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingVariantIndex(variantIndex);
    try {
      const fileArray = Array.from(files);
      const uploadedImages = await uploadImages(fileArray);

      // Use only the first uploaded image (single image per interface)
      const firstImage = uploadedImages[0];
      const imageObject = {
        public_id: firstImage.public_id,
        imageUrl: firstImage.url,
      };

      // Update variant image
      setFormData(prev => {
        const newVariants = [...prev.variants];
        newVariants[variantIndex] = {
          ...newVariants[variantIndex],
          imageUrl: imageObject
        };
        return { ...prev, variants: newVariants };
      });

      // Update preview
      setVariantPreviews(prev => ({
        ...prev,
        [variantIndex]: firstImage.url
      }));

      toast({
        title: 'Success',
        description: 'Variant image uploaded successfully.',
      });
    } catch (error) {
      console.error('Variant image upload error:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload variant image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingVariantIndex(null);
    }
  };

  // Remove variant image
  const removeVariantImage = (variantIndex: number) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        imageUrl: {
          public_id: '',
          imageUrl: ''
        }
      };
      return { ...prev, variants: newVariants };
    });

    setVariantPreviews(prev => ({
      ...prev,
      [variantIndex]: ''
    }));
  };

  // Variant management functions
  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newVariants = [...formData.variants];
    newVariants[index] = {
      ...newVariants[index],
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleVariantNumberChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newVariants = [...formData.variants];
    newVariants[index] = {
      ...newVariants[index],
      [name]: parseFloat(value) || 0,
    };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev?.variants,
        {
          variantType: 'Color',
          variantValue: '',
          priceAdjustment: 0,
          stockQuantity: 0,
          imageUrl: {
            public_id: '',
            imageUrl: ''
          },
          isActive: true,
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
    setVariantPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
  };

  // Create product via API
  const createProduct = async (productData: ProductFormData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Adjust based on your auth implementation
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create product: ${response.statusText}`);
    }

    return response.json();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.categoryId || formData.price <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (Name, Category, Price).',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.imageUrl.imageUrl) {
      toast({
        title: 'Validation Error',
        description: 'Product image is required.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingProduct(true);
    try {
      console.log("formData",formData)
      // Create the product
      const createdProduct = await createProduct(formData);
      
      toast({
        title: 'Success',
        description: `Product "${formData.name}" created successfully.`,
      });

      // Call onSave if provided
      if (onSave) {
        onSave(createdProduct);
      }
      
      // Close the form
      onCancel();
    } catch (error) {
      console.error('Product creation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create product.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingProduct(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <Button variant="outline" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Information Section */}
            <div className="space-y-4 border-b pb-4">
              <h2 className="text-lg font-semibold">General Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" value={formData.name} onChange={handleMainFieldChange} required />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (auto-generated)</Label>
                  <Input id="slug" value={formData.slug} onChange={handleMainFieldChange} />
                </div>
                <div>
                  <Label htmlFor="sku">SKU (auto-generated)</Label>
                  <Input id="sku" value={formData.sku} onChange={handleMainFieldChange} />
                </div>
                <div>
                  <Label htmlFor="categoryId">Category ID *</Label>
                  <Input id="categoryId" value={formData.categoryId} onChange={handleMainFieldChange} required />
                </div>
                <div>
                  <Label htmlFor="brandId">Brand ID</Label>
                  <Input id="brandId" value={formData.brandId} onChange={handleMainFieldChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea id="shortDescription" rows={2} value={formData.shortDescription} onChange={handleMainFieldChange} />
              </div>
              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea id="description" rows={4} value={formData.description} onChange={handleMainFieldChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input id="price" type="number" step="0.01" value={formData.price} onChange={handleNumberFieldChange} required />
                </div>
                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input id="salePrice" type="number" step="0.01" value={formData.salePrice} onChange={handleNumberFieldChange} />
                </div>
                <div>
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input id="costPrice" type="number" step="0.01" value={formData.costPrice} onChange={handleNumberFieldChange} />
                </div>
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input id="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleNumberFieldChange} />
                </div>
                <div>
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input id="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleNumberFieldChange} />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" step="0.01" value={formData.weight} onChange={handleNumberFieldChange} />
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input id="dimensions" value={formData.dimensions} onChange={handleMainFieldChange} />
                </div>
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input id="material" value={formData.material} onChange={handleMainFieldChange} />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" value={formData.color} onChange={handleMainFieldChange} />
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input id="size" value={formData.size} onChange={handleMainFieldChange} />
                </div>
                <div>
                  <Label htmlFor="warrantyPeriod">Warranty Period (months)</Label>
                  <Input id="warrantyPeriod" type="number" value={formData.warrantyPeriod} onChange={handleNumberFieldChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="careInstructions">Care Instructions</Label>
                <Textarea id="careInstructions" rows={2} value={formData.careInstructions} onChange={handleMainFieldChange} />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isFeatured" 
                    checked={formData.isFeatured} 
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFeatured: Boolean(checked) }))} 
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isActive" 
                    checked={formData.isActive} 
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: Boolean(checked) }))} 
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'active' | 'inactive' | 'out_of_stock') =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                  <Input id="metaTitle" value={formData.metaTitle} onChange={handleMainFieldChange} />
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                  <Textarea id="metaDescription" rows={2} value={formData.metaDescription} onChange={handleMainFieldChange} />
                </div>
              </div>
            </div>

            {/* Main Images Upload Section */}
            <div className="space-y-4 border-b pb-4">
              <h2 className="text-lg font-semibold">Product Images *</h2>
              <div>
                <Label htmlFor="main-image-upload">Upload Images</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="main-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </div>
                    )}
                  </div>
                  {mainImagePreview && (
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1 p-1">
                        <img
                          src={mainImagePreview}
                          alt="Product preview"
                          className="h-12 w-12 object-cover rounded-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeMainImage()}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {formData.imageUrl.imageUrl ? '1 image uploaded' : 'No image uploaded'}. Product image is required.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Variants Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Product Variants (Optional)</h2>
                <Button type="button" onClick={addVariant} size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Variant
                </Button>
              </div>

              {formData?.variants?.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No variants added yet. Add variants for different colors, sizes, or other variations.
                </p>
              )}

              <div className="space-y-4">
                {formData?.variants?.map((variant, index) => (
                  <Card key={index} className="p-4 bg-muted">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-md font-medium">Variant {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`variantType-${index}`}>Type</Label>
                        <Input
                          id={`variantType-${index}`}
                          name="variantType"
                          value={variant.variantType}
                          onChange={(e) => handleVariantChange(index, e)}
                          placeholder="e.g., Color, Size"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variantValue-${index}`}>Value</Label>
                        <Input
                          id={`variantValue-${index}`}
                          name="variantValue"
                          value={variant.variantValue}
                          onChange={(e) => handleVariantChange(index, e)}
                          placeholder="e.g., Red, Large"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor={`stockQuantity-${index}`}>Stock Quantity</Label>
                        <Input
                          id={`stockQuantity-${index}`}
                          name="stockQuantity"
                          type="number"
                          value={variant.stockQuantity}
                          onChange={(e) => handleVariantNumberChange(index, e)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`priceAdjustment-${index}`}>Price Adjustment</Label>
                        <Input
                          id={`priceAdjustment-${index}`}
                          name="priceAdjustment"
                          type="number"
                          step="0.01"
                          value={variant.priceAdjustment}
                          onChange={(e) => handleVariantNumberChange(index, e)}
                          placeholder="0.00 (+ or - from base price)"
                        />
                      </div>
                    </div>
                    
                    {/* Variant Images Section */}
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`variant-image-upload-${index}`}>Upload Variant Images</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`variant-image-upload-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleVariantImageChange(index, e)}
                          disabled={uploadingVariantIndex === index}
                        />
                        {uploadingVariantIndex === index && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </div>
                        )}
                      </div>
                      {variantPreviews[index] && (
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1 p-1">
                            <img
                              src={variantPreviews[index]}
                              alt="Variant preview"
                              className="h-12 w-12 object-cover rounded-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        id={`isActive-${index}`}
                        name="isActive"
                        checked={variant.isActive}
                        onCheckedChange={(checked) => {
                          const newVariants = [...formData.variants];
                          newVariants[index].isActive = Boolean(checked);
                          setFormData((prev) => ({ ...prev, variants: newVariants }));
                        }}
                      />
                      <Label htmlFor={`isActive-${index}`}>Active</Label>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isCreatingProduct}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-primary to-primary/90" disabled={isCreatingProduct}>
                {isCreatingProduct ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  </>
                ) : (
                  product ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};