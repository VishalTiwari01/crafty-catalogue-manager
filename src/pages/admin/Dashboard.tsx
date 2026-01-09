import { useEffect, useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  TrendingUp,
} from "lucide-react";
import { getDashboardStats } from "@/api/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Timeframe = "daily" | "weekly" | "monthly";

const Dashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<string>("operational");
  const [revenueChart, setRevenueChart] = useState<any>({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardStats();
        const data = response?.data;
        if (!data) return;

        setSystemStatus(data.systemStatus);
        setRevenueChart(data.revenueChart || { daily: [], weekly: [], monthly: [] });

        setStats([
          {
            title: "Total Users",
            value: data.users.total.toLocaleString(),
            description: "Registered users",
            icon: Users,
            trend: {
              value: Math.abs(data.users.growth),
              label: "from last month",
              isPositive: data.users.growth >= 0,
            },
          },
          {
            title: "Revenue",
            value: `₹${data.revenue.total.toLocaleString()}`,
            description: "This month revenue",
            icon: DollarSign,
            trend: {
              value: Math.abs(data.revenue.growth),
              label: "from last month",
              isPositive: data.revenue.growth >= 0,
            },
          },
          {
            title: "Orders",
            value: data.orders.total.toLocaleString(),
            description: "Orders placed",
            icon: ShoppingCart,
            trend: {
              value: Math.abs(data.orders.growth),
              label: "from last month",
              isPositive: data.orders.growth >= 0,
            },
          },
          {
            title: "Active Sessions",
            value: data.activeSessions.toLocaleString(),
            description: "Users currently online",
            icon: Activity,
            trend: {
              value: 0,
              label: "live",
              isPositive: true,
            },
          },
        ]);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = useMemo(() => {
    return revenueChart?.[timeframe] || [];
  }, [revenueChart, timeframe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here’s what’s happening with your store.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <TrendingUp
            className={`h-5 w-5 ${
              systemStatus === "operational"
                ? "text-success"
                : "text-destructive"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              systemStatus === "operational"
                ? "text-success"
                : "text-destructive"
            }`}
          >
            {systemStatus === "operational"
              ? "All systems operational"
              : "System issues detected"}
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* REVENUE CHART */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue Analytics</CardTitle>

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
            className="border bg-background text-sm rounded-md px-2 py-1"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </CardHeader>

        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No revenue data available yet.
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v: any) => [`₹${v}`, "Revenue"]} />
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
  );
};

export default Dashboard;