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

// Helper function to sort orders (Newest first)
const sortOrdersByDate = (a: Order, b: Order): number => {
  try {
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();
    return dateB - dateA; // Newest first
  } catch (e) {
    return 0;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        const sortedOrders = (data ?? []).sort(sortOrdersByDate);
        console.log("Fetched Orders (Sorted):", sortedOrders);
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
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
                <TableHead>Payment Status</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Billing Name</TableHead>
                <TableHead>Billing Address / Phone</TableHead>
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

                const billingAddressText = billingAddress
                  ? [
                      billingAddress.addressLine1,
                      billingAddress.addressLine2,
                      `${billingAddress.city}, ${billingAddress.state} ${billingAddress.postalCode}`,
                      billingAddress.country,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : "N/A";

                // Handle orders with no items
                if (items.length === 0) {
                  return (
                    <TableRow key={order._id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>{order.paymentStatus}</TableCell>
                      <TableCell>{order.currency}</TableCell>
                      <TableCell>{billingAddress?.name || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{billingAddressText}</span>
                          {billingAddress?.phone && (
                            <span className="text-xs text-muted-foreground">
                              Phone: {billingAddress.phone}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        colSpan={2}
                        className="text-muted-foreground italic"
                      >
                        No products
                      </TableCell>
                      <TableCell>
                        {order.currency} {order.subtotal.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {order.currency} {order.taxAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {order.currency} {order.totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                }

                // Render order with items
                return items.map((item, idx) => (
                  <TableRow key={`${order._id}-${idx}`}>
                    {idx === 0 && (
                      <>
                        <TableCell rowSpan={items.length}>
                          {order.orderNumber}
                        </TableCell>
                        <TableCell rowSpan={items.length}>
                          {order.paymentMethod}
                        </TableCell>
                        <TableCell rowSpan={items.length}>
                          {order.paymentStatus}
                        </TableCell>
                        <TableCell rowSpan={items.length}>
                          {order.currency}
                        </TableCell>
                        <TableCell rowSpan={items.length}>
                          {billingAddress?.name || "N/A"}
                        </TableCell>
                        <TableCell rowSpan={items.length}>
                          <div className="flex flex-col">
                            <span>{billingAddressText}</span>
                            {billingAddress?.phone && (
                              <span className="text-xs text-muted-foreground">
                                Phone: {billingAddress.phone}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </>
                    )}

                    <TableCell>
                      {item.productName}
                      {item.variantId?.variantValue
                        ? ` (${item.variantId.variantValue})`
                        : ""}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>

                    {idx === 0 && (
                      <>
                        <TableCell rowSpan={items.length}>
                          {order.currency} {order.subtotal.toFixed(2)}
                        </TableCell>
                        <TableCell rowSpan={items.length}>
                          {order.currency} {order.taxAmount.toFixed(2)}
                        </TableCell>
                        <TableCell rowSpan={items.length}>
                          {order.currency} {order.totalAmount.toFixed(2)}
                        </TableCell>
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
