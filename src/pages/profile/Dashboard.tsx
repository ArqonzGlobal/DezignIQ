import { Card } from "@/components/ui/card";
import { Package, Home, Briefcase, MessageSquare, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { title: "Total Products", value: "24", icon: Package, change: "+12%" },
  { title: "Properties Listed", value: "8", icon: Home, change: "+3%" },
  { title: "Active Projects", value: "15", icon: Briefcase, change: "+25%" },
  { title: "New Enquiries", value: "42", icon: MessageSquare, change: "+18%" },
];

const enquiryData = [
  { name: "Mon", enquiries: 12 },
  { name: "Tue", enquiries: 19 },
  { name: "Wed", enquiries: 15 },
  { name: "Thu", enquiries: 25 },
  { name: "Fri", enquiries: 22 },
  { name: "Sat", enquiries: 30 },
  { name: "Sun", enquiries: 18 },
];

const projectStatusData = [
  { name: "Upcoming", value: 5, color: "hsl(var(--primary))" },
  { name: "Ongoing", value: 8, color: "hsl(var(--accent))" },
  { name: "Completed", value: 12, color: "hsl(var(--success))" },
  { name: "Booked", value: 3, color: "hsl(var(--warning))" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-success mt-1">{stat.change} from last month</p>
              </div>
              <stat.icon className="h-8 w-8 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Enquiries This Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={enquiryData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="enquiries" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-3 border-b">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">New enquiry received</p>
                <p className="text-xs text-muted-foreground">For Modern Villa Project - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Product uploaded</p>
                <p className="text-xs text-muted-foreground">Premium Tiles Collection - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-success mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Project status updated</p>
                <p className="text-xs text-muted-foreground">Downtown Apartment - Completed - 1 day ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors">
              <p className="font-medium">Upload New Product</p>
              <p className="text-xs text-muted-foreground">Add products to your catalog</p>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors">
              <p className="font-medium">Add Property Listing</p>
              <p className="text-xs text-muted-foreground">List a new property for sale/rent</p>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors">
              <p className="font-medium">Create Requirement</p>
              <p className="text-xs text-muted-foreground">Generate BOQ for materials</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
