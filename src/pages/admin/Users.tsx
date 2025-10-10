// src/pages/Orders.tsx

import { useEffect, useState } from "react";
import { getAllOrders } from "@/api/api";
import { Order } from "@/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <h1 className="text-3xl font-bold">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Billing Name</TableHead>
                <TableHead>Billing Address</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Order Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.flatMap((order) => {
                const items = order.items ?? [];

                // If no items, return a single row with empty product fields
                if (items.length === 0) {
                  return (
                    <TableRow key={order._id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>{order.currency}</TableCell>
                      <TableCell>{order.billingAddress?.name || "N/A"}</TableCell>
                      <TableCell>
                        {order.billingAddress
                          ? [
                              order.billingAddress.addressLine1,
                              order.billingAddress.addressLine2,
                              `${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.postalCode}`,
                              order.billingAddress.country,
                            ]
                              .filter(Boolean)
                              .join(", ")
                          : "N/A"}
                      </TableCell>
                      <TableCell colSpan={2} className="text-muted-foreground italic">
                        No products
                      </TableCell>
                      <TableCell>{order.currency} {order.subtotal.toFixed(2)}</TableCell>
                      <TableCell>{order.currency} {order.taxAmount.toFixed(2)}</TableCell>
                      <TableCell>{order.currency} {order.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                }

                // If order has items, map them
                return items.map((item, idx) => (
                  <TableRow key={`${order._id}-${idx}`}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>{order.currency}</TableCell>
                    <TableCell>{order.billingAddress?.name || "N/A"}</TableCell>
                    <TableCell>
                      {order.billingAddress
                        ? [
                            order.billingAddress.addressLine1,
                            order.billingAddress.addressLine2,
                            `${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.postalCode}`,
                            order.billingAddress.country,
                          ]
                            .filter(Boolean)
                            .join(", ")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{order.currency} {order.subtotal.toFixed(2)}</TableCell>
                    <TableCell>{order.currency} {order.taxAmount.toFixed(2)}</TableCell>
                    <TableCell>{order.currency} {order.totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ));
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Orders;
