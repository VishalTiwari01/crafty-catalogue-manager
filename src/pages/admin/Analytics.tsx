import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Clock,
  Users,
  ShoppingCart,
  DollarSign,
  BarChart3
} from "lucide-react";

const Analytics = () => {
  const analyticsData = [
    {
      title: "Page Views",
      value: "124,573",
      description: "Total page views this month",
      icon: Eye,
      trend: { value: 18.2, label: "from last month", isPositive: true },
    },
    {
      title: "Unique Visitors",
      value: "45,231",
      description: "Individual site visitors",
      icon: Users,
      trend: { value: 12.5, label: "from last month", isPositive: true },
    },
    {
      title: "Conversion Rate",
      value: "3.4%",
      description: "Visitors who made a purchase",
      icon: MousePointer,
      trend: { value: -0.8, label: "from last month", isPositive: false },
    },
    {
      title: "Avg. Session Duration",
      value: "4m 32s",
      description: "Average time spent on site",
      icon: Clock,
      trend: { value: 5.3, label: "from last month", isPositive: true },
    },
  ];

  const topPages = [
    { page: "/products", views: 15420, percentage: 25.3 },
    { page: "/dashboard", views: 12890, percentage: 21.2 },
    { page: "/", views: 10560, percentage: 17.4 },
    { page: "/about", views: 8230, percentage: 13.5 },
    { page: "/contact", views: 6450, percentage: 10.6 },
  ];

  const trafficSources = [
    { source: "Organic Search", visitors: 18450, percentage: 40.8 },
    { source: "Direct", visitors: 12340, percentage: 27.3 },
    { source: "Social Media", visitors: 8920, percentage: 19.7 },
    { source: "Referral", visitors: 4120, percentage: 9.1 },
    { source: "Email", visitors: 1400, percentage: 3.1 },
  ];

  const revenueMetrics = [
    { metric: "Total Revenue", value: "$245,380", change: "+15.2%" },
    { metric: "Average Order Value", value: "$89.50", change: "+3.1%" },
    { metric: "Monthly Recurring Revenue", value: "$45,230", change: "+8.7%" },
    { metric: "Customer Lifetime Value", value: "$1,240", change: "+12.3%" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your website performance and user behavior.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Last 30 days</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsData.map((metric, index) => (
          <DashboardCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Traffic Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Traffic chart visualization</p>
                <p className="text-sm text-muted-foreground mt-2">Chart library integration needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium">{metric.metric}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      metric.change.startsWith('+') ? 'text-success' : 'text-destructive'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{page.page}</p>
                      <p className="text-sm text-muted-foreground">{page.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{page.percentage}%</p>
                    <div className="w-20 h-2 bg-muted rounded-full mt-1">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${page.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{source.source}</p>
                    <p className="text-sm text-muted-foreground">{source.visitors.toLocaleString()} visitors</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{source.percentage}%</p>
                    <div className="w-20 h-2 bg-muted rounded-full mt-1">
                      <div 
                        className="h-full bg-info rounded-full" 
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="font-medium text-success">High Performance</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Page load speed is 23% faster than industry average
              </p>
            </div>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center space-x-2 mb-2">
                <MousePointer className="h-5 w-5 text-warning" />
                <span className="font-medium text-warning">Needs Attention</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Mobile conversion rate could be improved by 15%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-info/10 border border-info/20">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="h-5 w-5 text-info" />
                <span className="font-medium text-info">Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Social media traffic has growth potential of 40%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;