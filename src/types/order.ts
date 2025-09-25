// src/types/order.ts

export interface OrderItem {
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  type: "billing" | "shipping";
  name: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  paymentMethod: string;
  items: OrderItem[];
  billingAddress?: Address;
  shippingAddress?: Address;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  createdAt?: string;
}
