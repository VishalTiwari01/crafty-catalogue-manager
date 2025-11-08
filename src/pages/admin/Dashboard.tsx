import { useEffect, useState } from "react";
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
  UserPlus
} from "lucide-react";
import { getAllOrders } from "@/api/api";

const Dashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all orders
        const orders = await getAllOrders();

        // ✅ Calculate total orders and total revenue
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce(
          (sum: number, order: any) => sum + (order.totalAmount || 0),
          0
        );

        // 👇 Now dynamically set your dashboard cards
        setStats([
          {
            title: "Total Users",
            value: "2,543", // Replace with real user data when ready
            description: "Active registered users",
            icon: Users,
            trend: { value: 12.5, label: "from last month", isPositive: true },
          },
          {
            title: "Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            description: "Total revenue (all orders)",
            icon: DollarSign,
            trend: { value: 8.2, label: "from last month", isPositive: true },
          },
          {
            title: "Orders",
            value: totalOrders.toLocaleString(),
            description: "Total orders processed",
            icon: ShoppingCart,
            trend: { value: 5.4, label: "from last month", isPositive: true },
          },
          {
            title: "Active Sessions",
            value: "573",
            description: "Users currently online",
            icon: Activity,
            trend: { value: 15.3, label: "from last hour", isPositive: true },
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
      {/* Page Header */}
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Revenue chart would go here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Integration with charting library needed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
