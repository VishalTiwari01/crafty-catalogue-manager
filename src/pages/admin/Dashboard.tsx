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

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      description: "Active registered users",
      icon: Users,
      trend: { value: 12.5, label: "from last month", isPositive: true },
    },
    {
      title: "Revenue",
      value: "$45,231",
      description: "Total revenue this month",
      icon: DollarSign,
      trend: { value: 8.2, label: "from last month", isPositive: true },
    },
    {
      title: "Orders",
      value: "1,234",
      description: "Total orders processed",
      icon: ShoppingCart,
      trend: { value: -2.4, label: "from last month", isPositive: false },
    },
    {
      title: "Active Sessions",
      value: "573",
      description: "Users currently online",
      icon: Activity,
      trend: { value: 15.3, label: "from last hour", isPositive: true },
    },
  ];

  const recentActivity = [
    { action: "New user registered", user: "John Doe", time: "2 minutes ago", type: "user" },
    { action: "Product updated", item: "Art & Craft Set", time: "1 hour ago", type: "product" },
    { action: "Order completed", order: "#12345", time: "2 hours ago", type: "order" },
    { action: "New review posted", product: "Building Blocks Pro", time: "3 hours ago", type: "review" },
    { action: "User profile updated", user: "Jane Smith", time: "5 hours ago", type: "user" },
  ];

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-success" />
          <span className="text-sm font-medium text-success">All systems operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart Placeholder */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Revenue chart would go here</p>
                <p className="text-sm text-muted-foreground mt-2">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user || activity.item || activity.order || activity.product}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Add Product</p>
                <p className="text-sm text-muted-foreground">Create new product</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-muted-foreground">User administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">View Analytics</p>
                <p className="text-sm text-muted-foreground">Performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Generate Report</p>
                <p className="text-sm text-muted-foreground">Business insights</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;