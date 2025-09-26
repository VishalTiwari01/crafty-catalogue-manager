// src/pages/Orders.tsx

import { useEffect, useState } from "react";
import { getAllOrders } from "@/api/api";
import { Order } from "@/types/order";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getAllOrders();
      console.log("Fetched Orders:", data);
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Orders</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">
                Order #{order.orderNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Payment Method: <strong>{order.paymentMethod}</strong> | Currency:{" "}
                {order.currency}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Address Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Billing */}
                <div>
                  <h3 className="font-semibold mb-1">Billing Address</h3>
                  {order.billingAddress ? (
                    <>
                      <p>{order.billingAddress.name}</p>
                      {order.billingAddress.company && <p>{order.billingAddress.company}</p>}
                      <p>{order.billingAddress.addressLine1}</p>
                      {order.billingAddress.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
                      <p>
                        {order.billingAddress.city}, {order.billingAddress.state}{" "}
                        {order.billingAddress.postalCode}
                      </p>
                      <p>{order.billingAddress.country}</p>
                      {order.billingAddress.phone && <p>{order.billingAddress.phone}</p>}
                    </>
                  ) : (
                    <p className="text-muted-foreground">Not available</p>
                  )}
                </div>

                {/* Shipping */}
                <div>
                  <h3 className="font-semibold mb-1">Shipping Address</h3>
                  {order.shippingAddress ? (
                    <>
                      <p>{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Not available</p>
                  )}
                </div>
              </div>

              {/* Product Items */}
              <div>
                <h3 className="font-semibold mb-2">Products</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items?.length > 0 ? (
                      order.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.productSku}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{order.currency} {item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell>{order.currency} {item.totalPrice.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-muted-foreground">
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-4">
                <div>Subtotal: {order.currency} {order.subtotal.toFixed(2)}</div>
                <div>Tax: {order.currency} {order.taxAmount.toFixed(2)}</div>
                <div>Shipping: {order.currency} {order.shippingAmount.toFixed(2)}</div>
                <div>Discount: -{order.currency} {order.discountAmount.toFixed(2)}</div>
                <div className="col-span-2 font-semibold text-lg">
                  Total: {order.currency} {order.totalAmount.toFixed(2)}
                </div>
                {order.notes && (
                  <div className="col-span-2 text-muted-foreground italic">
                    Notes: {order.notes}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Orders;
