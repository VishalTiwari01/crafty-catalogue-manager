import { useEffect, useState, useMemo } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  TrendingUp,
  Package,
  Eye,
  UserPlus,
} from "lucide-react";
import { getAllOrders } from "@/api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RevenuePoint = {
  label: string;
  revenue: number;
};

type Timeframe = "daily" | "weekly" | "monthly";

const Dashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const fetchedOrders = await getAllOrders();
        console.log("Fetched orders:", fetchedOrders);

        const safeOrders = Array.isArray(fetchedOrders) ? fetchedOrders : [];
        setOrders(safeOrders);

        const totalOrders = safeOrders.length;
        const totalRevenue = safeOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        setStats([
          {
            title: "Total Users",
            value: "2,543",
            description: "Active registered users",
            icon: Users,
            trend: {
              value: 12.5,
              label: "from last month",
              isPositive: true,
            },
          },
          {
            title: "Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            description: "Total revenue (all orders)",
            icon: DollarSign,
            trend: {
              value: 8.2,
              label: "from last month",
              isPositive: true,
            },
          },
          {
            title: "Orders",
            value: totalOrders.toLocaleString(),
            description: "Total orders processed",
            icon: ShoppingCart,
            trend: {
              value: 5.4,
              label: "from last month",
              isPositive: true,
            },
          },
          {
            title: "Active Sessions",
            value: "573",
            description: "Users currently online",
            icon: Activity,
            trend: {
              value: 15.3,
              label: "from last hour",
              isPositive: true,
            },
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getOrderDate = (order: any): Date | null => {
    const raw = order.createdAt || order.registrationDate;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  };

  const getWeekStartLabel = (date: Date): string => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().slice(0, 10);
  };

  const getMonthLabel = (date: Date): string => {
    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  const revenueData: RevenuePoint[] = useMemo(() => {
    const map: Record<string, number> = {};

    orders.forEach((order) => {
      const date = getOrderDate(order);
      if (!date) return;

      let key = "";

      if (timeframe === "daily") key = date.toISOString().slice(0, 10);
      else if (timeframe === "weekly") key = getWeekStartLabel(date);
      else key = getMonthLabel(date);

      map[key] = (map[key] || 0) + (order.totalAmount || 0);
    });

    return Object.entries(map)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([label, revenue]) => ({ label, revenue }));
  }, [orders, timeframe]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <UserPlus className="h-4 w-4 text-primary" />;
      case "product":
        return <Package className="h-4 w-4 text-warning" />;
      case "order":
        return <ShoppingCart className="h-4 w-4 text-success" />;
      case "review":
        return <Eye className="h-4 w-4 text-info" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here’s what’s happening with your store.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-success" />
          <span className="text-sm font-medium text-success">
            All systems operational
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue Overview</CardTitle>

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground hidden sm:inline">
                View:
              </span>
              <select
                value={timeframe}
                onChange={(e) =>
                  setTimeframe(e.target.value as Timeframe)
                }
                className="border bg-background text-sm rounded-md px-2 py-1"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </CardHeader>

          <CardContent>
            {revenueData.length === 0 ? (
              <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Not enough data to display revenue chart yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      formatter={(value: any) => [`₹${value}`, "Revenue"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
