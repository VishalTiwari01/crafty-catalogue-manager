// src/components/ProductForm.tsx

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2 } from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Product, mainFiles: File[], variantFiles: { [key: number]: File[] }) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Product>({
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
    status: 'active',
    variants: [],
    
  });

  const [mainSelectedFiles, setMainSelectedFiles] = useState<File[]>([]);
  const [mainImagePreviews, setMainImagePreviews] = useState<string[]>([]);

  const [variantFiles, setVariantFiles] = useState<{ [key: number]: File[] }>({});
  const [variantPreviews, setVariantPreviews] = useState<{ [key: number]: string[] }>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
      if (product.images) {
        setMainImagePreviews(product.images);
      }
      const initialVariantPreviews: { [key: number]: string[] } = {};
      product.variants.forEach((variant, index) => {
        initialVariantPreviews[index] = variant.images;
      });
      setVariantPreviews(initialVariantPreviews);
    }
  }, [product]);

  const handleMainFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
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
        ...prev.variants,
        {
          variantType: 'Color',
          variantValue: '',
          priceAdjustment: 0,
          stockQuantity: 0,
          images: [],
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
    setVariantFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[index];
      return newFiles;
    });
    setVariantPreviews((prev) => {
      const newPreviews = { ...prev };
      if (newPreviews[index]) {
        newPreviews[index].forEach(URL.revokeObjectURL);
        delete newPreviews[index];
      }
      return newPreviews;
    });
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setMainSelectedFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setMainImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeMainImage = (index: number) => {
    URL.revokeObjectURL(mainImagePreviews[index]);
    setMainImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setMainSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleVariantImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setVariantFiles((prev) => ({
        ...prev,
        [index]: [...(prev[index] || []), ...newFiles],
      }));

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setVariantPreviews((prev) => ({
        ...prev,
        [index]: [...(prev[index] || []), ...newPreviews],
      }));
    }
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    const previews = variantPreviews[variantIndex];
    if (previews && previews[imageIndex]) {
      URL.revokeObjectURL(previews[imageIndex]);
    }

    setVariantPreviews((prev) => {
      const newPreviews = { ...prev };
      if (newPreviews[variantIndex]) {
        newPreviews[variantIndex] = newPreviews[variantIndex].filter((_, i) => i !== imageIndex);
      }
      return newPreviews;
    });

    setVariantFiles((prev) => {
      const newFiles = { ...prev };
      if (newFiles[variantIndex]) {
        newFiles[variantIndex] = newFiles[variantIndex].filter((_, i) => i !== imageIndex);
      }
      return newFiles;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.categoryId || formData.price <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // Call onSave with all form data, including files
    onSave(formData, mainSelectedFiles, variantFiles);
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
                  <Label htmlFor="categoryId">Category ID *</Label>
                  <Input id="categoryId" value={formData.categoryId} onChange={handleMainFieldChange} required />
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
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input id="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleNumberFieldChange} />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" step="0.01" value={formData.weight} onChange={handleNumberFieldChange} />
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isFeatured" checked={formData.isFeatured} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFeatured: Boolean(checked) }))} />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: Boolean(checked) }))} />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'draft' | 'archived') =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Main Images Upload Section */}
            <div className="space-y-4 border-b pb-4">
              <h2 className="text-lg font-semibold">Product Images</h2>
              <div>
                <Label htmlFor="main-image-upload">Upload Images</Label>
                <div className="space-y-2">
                  <Input
                    id="main-image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                  {/* <div className="flex flex-wrap gap-2">
                    {mainImagePreviews.map((image, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 p-1">
                        <img
                          src={image}
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
                  </div> */}
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

              {formData.variants.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No variants added yet.
                </p>
              )}

              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
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
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variantValue-${index}`}>Value</Label>
                        <Input
                          id={`variantValue-${index}`}
                          name="variantValue"
                          value={variant.variantValue}
                          onChange={(e) => handleVariantChange(index, e)}
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
                        />
                      </div>
                    </div>
                    
                    {/* Variant Images Section */}
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`variant-image-upload-${index}`}>Upload Variant Images</Label>
                      <Input
                        id={`variant-image-upload-${index}`}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleVariantImageChange(index, e)}
                      />
                      <div className="flex flex-wrap gap-2">
                        {variantPreviews[index]?.map((image, imageIndex) => (
                          <Badge key={imageIndex} variant="secondary" className="flex items-center gap-1 p-1">
                            <img
                              src={image}
                              alt={`Variant preview ${imageIndex + 1}`}
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
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-primary to-primary/90">
                {product ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};