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

// Helper function to validate MongoDB ObjectId
const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

interface ProductImage {
  imageUrl: string;
  public_id: string;
}

interface ProductVariant {
  productId?: string; // Added to align with CreateProductVariantDto
  variantType: string;
  variantValue: string;
  priceAdjustment: number;
  stockQuantity: number;
  imageUrl: ProductImage[];
  isActive: boolean;
}

interface ProductFormData {
  _id?: string; // Optional, only for existing products
  name: string;
  description?: string;
  shortDescription?: string;
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
  imageUrl: ProductImage[];
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';
  variants: ProductVariant[];
}

interface ProductFormProps {
  product?: Partial<ProductFormData>;
  onSave?: (product: ProductFormData) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
  const { toast } = useToast();

  // Main form state with safe defaults
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    price: 0,
    salePrice: 0,
    stockQuantity: 0,
    weight: 0,
    size: '',
    careInstructions: '',
    warrantyPeriod: 0,
    isFeatured: false,
    isActive: true,
    imageUrl: [],
    status: 'active',
    variants: [],
  });

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState<number | null>(null);

  // API base URL
  const API_BASE_URL =  'https://monkfish-app-phfed.ondigitalocean.app/api';

  useEffect(() => {
    if (product) {
      // Safely merge product data with defaults
      setFormData({
        name: product.name ?? '',
        description: product.description ?? '',
        shortDescription: product.shortDescription ?? '',
        categoryId: product.categoryId ?? '',
        price: product.price ?? 0,
        salePrice: product.salePrice ?? 0,
        stockQuantity: product.stockQuantity ?? 0,
        weight: product.weight ?? 0,
        size: product.size ?? '',
        careInstructions: product.careInstructions ?? '',
        warrantyPeriod: product.warrantyPeriod ?? 0,
        isFeatured: product.isFeatured ?? false,
        isActive: product.isActive ?? true,
        imageUrl: Array.isArray(product.imageUrl) ? product.imageUrl : [],
        status: product.status ?? 'active',
        variants: Array.isArray(product.variants)
          ? product.variants.map((variant) => ({
            productId: variant.productId ?? '',
            variantType: variant.variantType ?? 'Color',
            variantValue: variant.variantValue ?? '',
            priceAdjustment: variant.priceAdjustment ?? 0,
            stockQuantity: variant.stockQuantity ?? 0,
            imageUrl: Array.isArray(variant.imageUrl) ? variant.imageUrl : [],
            isActive: variant.isActive ?? true,
          }))
          : [],
      });
    }
  }, [product]);

  // Handle main field changes
  const handleMainFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNumberFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: parseFloat(value) || 0,
    }));
  };

  // Demo function for image upload
  const uploadImages = async (files: File[]): Promise<Array<{ url: string; public_id: string }>> => {    // add api for upload image here
    // Example: Call your image upload API and return the uploaded image URLs
    // This is a demo, replace with actual API call if needed
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('image', file));
      const response = await fetch(`${API_BASE_URL}/uploads/images`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response data:', data);
      return data; // [{ url, public_id }]
    } catch (error) {
      toast({
        title: 'Upload Error',
        description: 'Failed to upload images. Please try again.',
        variant: 'destructive',
      });
      console.error('Image upload error:', error);
      throw new Error('Failed to upload images');

    }

    // return files.map((file, index) => ({
    //   url: `https://picsum.photos/400/400?random=${Date.now()}-${index}`,
    //   public_id: `demo_image_${Date.now()}_${index}`,
    // }));
  };

  // Handle main image upload
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      const uploadedImages = await uploadImages(fileArray) as any;

      // const imageObjects: ProductImage[] = uploadedImages.map((img) => ({
      //   imageUrl: uploadedImages.url,
      //   public_id: uploadedImages.public_id,
      // }));

      setFormData((prev) => ({
        ...prev,
        imageUrl: [...(prev.imageUrl ?? []), {
          imageUrl: uploadedImages.url,
          public_id: uploadedImages.public_id,
        }],
      }));

      toast({
        title: 'Success',
        description: `${uploadedImages.length} image(s) uploaded successfully.`,
      });
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Remove main image
  const removeMainImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: (prev.imageUrl ?? []).filter((_, i) => i !== index),
    }));
  };

  // Handle variant image upload
  const handleVariantImageChange = async (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingVariantIndex(variantIndex);
    try {
      const fileArray = Array.from(files);
      const uploadedImages = await uploadImages(fileArray) as any;



      setFormData((prev) => {
        const newVariants = [...(prev.variants ?? [])];
        newVariants[variantIndex] = {
          ...newVariants[variantIndex],
          imageUrl: [...(newVariants[variantIndex].imageUrl ?? []), {
          imageUrl: uploadedImages.url,
          public_id: uploadedImages.public_id,
        }],
        };
        return { ...prev, variants: newVariants };
      });

      toast({
        title: 'Success',
        description: `${uploadedImages.length} variant image(s) uploaded successfully.`,
      });
    } catch (error) {
      console.error('Variant image upload error:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload variant images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingVariantIndex(null);
    }
  };

  // Remove variant image
  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    setFormData((prev) => {
      const newVariants = [...(prev.variants ?? [])];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        imageUrl: (newVariants[variantIndex].imageUrl ?? []).filter((_, i) => i !== imageIndex),
      };
      return { ...prev, variants: newVariants };
    });
  };

  // Variant management
  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newVariants = [...(formData.variants ?? [])];
    newVariants[index] = {
      ...newVariants[index],
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleVariantNumberChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newVariants = [...(formData.variants ?? [])];
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
        ...(prev.variants ?? []),
        {
          productId: '', // Will be set on submit
          variantType: 'Color',
          variantValue: '',
          priceAdjustment: 0,
          stockQuantity: 0,
          imageUrl: [],
          isActive: true,
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).filter((_, i) => i !== index),
    }));
  };

  // Create or update product via API
  const createProduct = async (productData: ProductFormData, isUpdate: boolean = false) => {
    const endpoint = isUpdate ? `${API_BASE_URL}/products/${product?._id}` : `${API_BASE_URL}/products`;
    const method = isUpdate ? 'PUT' : 'POST';

    // Transform data to match DTO
    const transformedData = {
      name: productData.name,
      description: productData.description || undefined,
      shortDescription: productData.shortDescription || undefined,
      categoryId: productData.categoryId || undefined,
      price: productData.price,
      salePrice: productData.salePrice || undefined,
      stockQuantity: productData.stockQuantity || undefined,
      weight: productData.weight || undefined,
      size: productData.size || undefined,
      careInstructions: productData.careInstructions || undefined,
      warrantyPeriod: productData.warrantyPeriod || undefined,
      isFeatured: productData.isFeatured ?? false,
      isActive: productData.isActive ?? true,
      status: productData.status ?? 'active',
      imageUrl: productData.imageUrl,
      variants: (productData.variants ?? []).map((variant) => ({
        productId: variant.productId || product?._id || '', // Use existing productId or leave empty for creation
        variantType: variant.variantType,
        variantValue: variant.variantValue,
        priceAdjustment: variant.priceAdjustment || undefined,
        stockQuantity: variant.stockQuantity || undefined,
        imageUrl: variant.imageUrl,
        isActive: variant.isActive ?? true,
      })),
    };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${isUpdate ? 'update' : 'create'} product: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Product name is required.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.categoryId) {
      toast({
        title: 'Validation Error',
        description: 'A valid Category Name is required.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.price <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Price must be greater than 0.',
        variant: 'destructive',
      });
      return;
    }

    if ((formData.imageUrl ?? []).length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one product image is required.',
        variant: 'destructive',
      });
      return;
    }

    // Validate variants
    for (const [index, variant] of (formData.variants ?? []).entries()) {
      if (!variant.variantType || !variant.variantValue) {
        toast({
          title: 'Validation Error',
          description: `Variant ${index + 1}: Type and value are required.`,
          variant: 'destructive',
        });
        return;
      }
      if ((variant.imageUrl ?? []).length === 0) {
        toast({
          title: 'Validation Error',
          description: `Variant ${index + 1}: At least one image is required.`,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsCreatingProduct(true);
    try {
      const isUpdate = !!product?._id;
      const createdProduct = await createProduct(formData, isUpdate);

      toast({
        title: 'Success',
        description: `Product "${formData.name}" ${isUpdate ? 'updated' : 'created'} successfully.`,
      });

      if (onSave) {
        onSave(createdProduct);
      }

      onCancel();
    } catch (error) {
      // console.error('Product operation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Failed to ${product?._id ? 'update' : 'create'} product.`,
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
            <CardTitle className="text-2xl">{product?._id ? 'Edit Product' : 'Add New Product'}</CardTitle>
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
                  <Input id="name" value={formData.name ?? ''} onChange={handleMainFieldChange} required />
                </div>
                <div>
                  <Label htmlFor="categoryId">Category ID *</Label>
                  <Input id="categoryId" value={formData.categoryId ?? ''} onChange={handleMainFieldChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea id="shortDescription" rows={2} value={formData.shortDescription ?? ''} onChange={handleMainFieldChange} />
              </div>
              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea id="description" rows={4} value={formData.description ?? ''} onChange={handleMainFieldChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input id="price" type="number" step="0.01" value={formData.price ?? 0} onChange={handleNumberFieldChange} required />
                </div>
                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input id="salePrice" type="number" step="0.01" value={formData.salePrice ?? 0} onChange={handleNumberFieldChange} />
                </div>
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input id="stockQuantity" type="number" value={formData.stockQuantity ?? 0} onChange={handleNumberFieldChange} />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" step="0.01" value={formData.weight ?? 0} onChange={handleNumberFieldChange} />
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input id="size" value={formData.size ?? ''} onChange={handleMainFieldChange} />
                </div>
                <div>
                  <Label htmlFor="warrantyPeriod">Warranty Period (months)</Label>
                  <Input id="warrantyPeriod" type="number" value={formData.warrantyPeriod ?? 0} onChange={handleNumberFieldChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="careInstructions">Care Instructions</Label>
                <Textarea id="careInstructions" rows={2} value={formData.careInstructions ?? ''} onChange={handleMainFieldChange} />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured ?? false}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFeatured: Boolean(checked) }))}
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive ?? true}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: Boolean(checked) }))}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status ?? 'active'}
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
            </div>

            {/* Main Images Upload Section */}
            <div className="space-y-4 border-b pb-4">
              <h2 className="text-lg font-semibold">Product Images *</h2>
              <div>
                <Label htmlFor="main-image-upload">Upload Images (Multiple)</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="main-image-upload"
                      type="file"
                      accept="image/*"
                      multiple
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
                  {(formData.imageUrl ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(formData.imageUrl ?? []).map((image, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 p-1">
                          <img
                            src={image.imageUrl}
                            alt={`Product preview ${index + 1}`}
                            className="h-12 w-12 object-cover rounded-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeMainImage(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {(formData.imageUrl ?? []).length} image(s) uploaded. At least one image is required.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Variants Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Product Variants</h2>
                <Button type="button" onClick={addVariant} size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Variant
                </Button>
              </div>

              {(formData.variants ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No variants added yet. Add variants for different colors, sizes, or other variations.
                </p>
              )}

              <div className="space-y-4">
                {(formData.variants ?? []).map((variant, index) => (
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
                          value={variant.variantType ?? 'Color'}
                          onChange={(e) => handleVariantChange(index, e)}
                          placeholder="e.g., Color, Size"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variantValue-${index}`}>Value</Label>
                        <Input
                          id={`variantValue-${index}`}
                          name="variantValue"
                          value={variant.variantValue ?? ''}
                          onChange={(e) => handleVariantChange(index, e)}
                          placeholder="e.g., Red, Large"
                          required
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
                          value={variant.stockQuantity ?? 0}
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
                          value={variant.priceAdjustment ?? 0}
                          onChange={(e) => handleVariantNumberChange(index, e)}
                          placeholder="0.00 (+ or - from base price)"
                        />
                      </div>
                    </div>

                    {/* Variant Images Section */}
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`variant-image-upload-${index}`}>Upload Variant Images *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`variant-image-upload-${index}`}
                          type="file"
                          accept="image/*"
                          multiple
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
                      {(variant.imageUrl ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(variant.imageUrl ?? []).map((image, imageIndex) => (
                            <Badge key={imageIndex} variant="secondary" className="flex items-center gap-1 p-1">
                              <img
                                src={image.imageUrl}
                                alt={`Variant ${index + 1} image ${imageIndex + 1}`}
                                className="h-12 w-12 object-cover rounded-sm"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariantImage(index, imageIndex)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {(variant.imageUrl ?? []).length} variant image(s) uploaded. At least one image is required.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        id={`isActive-${index}`}
                        name="isActive"
                        checked={variant.isActive ?? true}
                        onCheckedChange={(checked) => {
                          const newVariants = [...(formData.variants ?? [])];
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
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-primary/90"
                disabled={isCreatingProduct}
              >
                {isCreatingProduct ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {product?._id ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  product?._id ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};