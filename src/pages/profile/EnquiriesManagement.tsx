import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Mail, Phone, MessageCircle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockEnquiries = [
  {
    id: "1",
    senderName: "Rahul Sharma",
    senderEmail: "rahul@example.com",
    senderPhone: "+91 98765 43210",
    enquiryType: "Product",
    message: "Interested in Premium Ceramic Tiles. What are the bulk pricing options?",
    status: "new",
    date: "2024-01-15",
  },
  {
    id: "2",
    senderName: "Priya Patel",
    senderEmail: "priya@example.com",
    senderPhone: "+91 87654 32109",
    enquiryType: "Property",
    message: "Would like to schedule a site visit for the Downtown Apartment",
    status: "replied",
    date: "2024-01-14",
  },
];

const statusColors = {
  new: "bg-green-500",
  replied: "bg-blue-500",
  closed: "bg-gray-500",
};

export default function EnquiriesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enquiries Management</h1>
        <p className="text-muted-foreground">Manage customer enquiries and requests</p>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="replied">Replied</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {mockEnquiries.map((enquiry) => (
              <Card key={enquiry.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{enquiry.senderName}</h3>
                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {enquiry.senderEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {enquiry.senderPhone}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge>{enquiry.enquiryType}</Badge>
                        <Badge className={statusColors[enquiry.status as keyof typeof statusColors]}>
                          {enquiry.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{enquiry.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{enquiry.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedEnquiry(enquiry)}>
                        <MessageCircle className="h-4 w-4" />
                        Reply
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Reply to Enquiry</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Original Message</Label>
                          <p className="text-sm p-3 bg-muted rounded-lg mt-2">{enquiry.message}</p>
                        </div>
                        <div>
                          <Label htmlFor="reply">Your Reply</Label>
                          <Textarea id="reply" placeholder="Type your reply..." rows={6} />
                        </div>
                        <Button className="w-full">Send Reply</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Mark as Read
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
