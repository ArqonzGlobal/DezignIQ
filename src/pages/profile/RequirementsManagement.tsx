import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockRequirements = [
  {
    id: "1",
    description: "Cement for foundation",
    quantity: 500,
    specifications: "Grade 53 Portland Cement",
    timeline: "2 weeks",
    location: "Mumbai",
    status: "pending",
  },
  {
    id: "2",
    description: "Steel bars for reinforcement",
    quantity: 1000,
    specifications: "TMT 500D, 12mm diameter",
    timeline: "1 week",
    location: "Pune",
    status: "in_progress",
  },
];

const statusColors = {
  pending: "bg-yellow-500",
  in_progress: "bg-blue-500",
  fulfilled: "bg-green-500",
};

export default function RequirementsManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Requirements Management</h1>
          <p className="text-muted-foreground">Manage material requirements and BOQ</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Requirement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Item Description</Label>
                <Textarea id="description" placeholder="Describe the material or service needed" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input id="timeline" placeholder="e.g., 2 weeks" />
                </div>
              </div>
              <div>
                <Label htmlFor="specifications">Specifications</Label>
                <Textarea id="specifications" placeholder="Technical specifications" rows={3} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Delivery location" />
              </div>
              <Button className="w-full">Save Requirement</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requirements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {mockRequirements.map((req) => (
            <Card key={req.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="text-lg font-semibold">{req.description}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{req.specifications}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[req.status as keyof typeof statusColors]}>{req.status}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm ml-8">
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium">{req.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timeline</p>
                      <p className="font-medium">{req.timeline}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{req.location}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
