import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Package, Home, Star, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const performanceData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 70 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 72 },
  { month: "May", score: 80 },
  { month: "Jun", score: 85 },
];

const engagementData = [
  { category: "Products", views: 1250 },
  { category: "Properties", views: 890 },
  { category: "Projects", views: 1450 },
  { category: "Profile", views: 670 },
];

export default function AQIQManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AQ-IQ Analytics</h1>
        <p className="text-muted-foreground">Account Quality & Intelligence Quotient</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Overall AQ-IQ Score</h2>
            <p className="text-muted-foreground">Your business performance index</p>
          </div>
          <div className="text-5xl font-bold text-primary">85</div>
        </div>
        <Progress value={85} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">Excellent - You're in the top 15% of users</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profile Completeness</p>
              <p className="text-2xl font-bold">92%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Package className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Listings</p>
              <p className="text-2xl font-bold">47</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Star className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
              <p className="text-2xl font-bold">4.8</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
              <p className="text-2xl font-bold">+24%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="category" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Improvement Suggestions</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium">Add more product images</p>
              <p className="text-sm text-muted-foreground">
                Products with 5+ images get 3x more engagement
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium">Complete your professional bio</p>
              <p className="text-sm text-muted-foreground">
                A detailed bio increases trust and credibility
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium">Respond to enquiries faster</p>
              <p className="text-sm text-muted-foreground">
                Average response time: 4 hours. Aim for under 2 hours
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
