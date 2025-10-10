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
              {orders.map((order) => {
                const items = order.items ?? [];
                const billingAddress = order.addresses?.find(
                  (addr) => addr.type === "billing"
                );

                // Render a single row if no items
                if (items.length === 0) {
                  return (
                    <TableRow key={order._id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>{order.currency}</TableCell>
                      <TableCell>{billingAddress?.name || "N/A"}</TableCell>
                      <TableCell>
                        {billingAddress
                          ? [
                              billingAddress.addressLine1,
                              billingAddress.addressLine2,
                              `${billingAddress.city}, ${billingAddress.state} ${billingAddress.postalCode}`,
                              billingAddress.country,
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

                // If order has items, render with rowSpan
                return items.map((item, idx) => (
                  <TableRow key={`${order._id}-${idx}`}>
                    {idx === 0 && (
                      <>
                        <TableCell rowSpan={items.length}>{order.orderNumber}</TableCell>
                        <TableCell rowSpan={items.length}>{order.paymentMethod}</TableCell>
                        <TableCell rowSpan={items.length}>{order.currency}</TableCell>
                        <TableCell rowSpan={items.length}>{billingAddress?.name || "N/A"}</TableCell>
                        <TableCell rowSpan={items.length}>
                          {billingAddress
                            ? [
                                billingAddress.addressLine1,
                                billingAddress.addressLine2,
                                `${billingAddress.city}, ${billingAddress.state} ${billingAddress.postalCode}`,
                                billingAddress.country,
                              ]
                                .filter(Boolean)
                                .join(", ")
                            : "N/A"}
                        </TableCell>
                      </>
                    )}

                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>

                    {idx === 0 && (
                      <>
                        <TableCell rowSpan={items.length}>{order.currency} {order.subtotal.toFixed(2)}</TableCell>
                        <TableCell rowSpan={items.length}>{order.currency} {order.taxAmount.toFixed(2)}</TableCell>
                        <TableCell rowSpan={items.length}>{order.currency} {order.totalAmount.toFixed(2)}</TableCell>
                      </>
                    )}
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
