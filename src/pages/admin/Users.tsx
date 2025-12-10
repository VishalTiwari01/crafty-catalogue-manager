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

// Sort by date (newest first)
const sortOrdersByDate = (a: Order, b: Order) => {
  const dateA = new Date(a.createdAt ?? 0).getTime();
  const dateB = new Date(b.createdAt ?? 0).getTime();
  return dateB - dateA;
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        const sortedOrders = (data ?? []).sort(sortOrdersByDate);
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
                <TableHead>Order ID</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Payment Status</TableHead>
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
                const billing = order.addresses?.find((a) => a.type === "billing");

                const billingAddressText = billing
                  ? [
                      billing.addressLine1,
                      billing.addressLine2,
                      `${billing.city}, ${billing.state} ${billing.postalCode}`,
                      billing.country,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : "N/A";

                if (items.length === 0) {
                  return (
                    <TableRow key={order._id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>{order.paymentStatus}</TableCell>
                      <TableCell>{billing?.name || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{billingAddressText}</span>
                          {billing?.phone && (
                            <span className="text-xs text-muted-foreground">
                              Phone: {billing.phone}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell colSpan={2} className="italic text-muted-foreground">
                        No products
                      </TableCell>

                      <TableCell>{order.subtotal.toFixed(2)}</TableCell>
                      <TableCell>{order.taxAmount.toFixed(2)}</TableCell>
                      <TableCell>{order.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                }

                return items.map((item, idx) => (
                  <TableRow key={`${order._id}-${idx}`}>
                    {idx === 0 && (
                      <>
                        <TableCell rowSpan={items.length}>{order.orderNumber}</TableCell>
                        <TableCell rowSpan={items.length}>{order.paymentMethod}</TableCell>
                        <TableCell rowSpan={items.length}>{order.paymentStatus}</TableCell>
                        <TableCell rowSpan={items.length}>{billing?.name || "N/A"}</TableCell>
                        <TableCell rowSpan={items.length}>
                          <div className="flex flex-col">
                            <span>{billingAddressText}</span>
                            {billing?.phone && (
                              <span className="text-xs text-muted-foreground">
                                Phone: {billing.phone}
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
                          {order.subtotal.toFixed(2)}
                        </TableCell>
                        <TableCell rowSpan={items.length}>
                          {order.taxAmount.toFixed(2)}
                        </TableCell>
                        <TableCell rowSpan={items.length}>
                          {order.totalAmount.toFixed(2)}
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
