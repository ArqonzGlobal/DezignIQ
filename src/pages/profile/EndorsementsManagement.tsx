import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X } from "lucide-react";

const mockEndorsements = [
  {
    id: "1",
    endorserName: "Amit Kumar",
    endorserCompany: "BuildCo Developers",
    testimonial:
      "Excellent work on our commercial project. The attention to detail and professionalism was outstanding.",
    isFeatured: true,
    isApproved: true,
    date: "2024-01-10",
  },
  {
    id: "2",
    endorserName: "Sneha Reddy",
    endorserCompany: "Urban Homes",
    testimonial:
      "Great experience working together. Delivered the project on time with exceptional quality.",
    isFeatured: false,
    isApproved: false,
    date: "2024-01-12",
  },
];

export default function EndorsementsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Endorsements</h1>
        <p className="text-muted-foreground">Manage testimonials and endorsements</p>
      </div>

      <div className="grid gap-4">
        {mockEndorsements.map((endorsement) => (
          <Card key={endorsement.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{endorsement.endorserName}</h3>
                <p className="text-sm text-muted-foreground">{endorsement.endorserCompany}</p>
              </div>
              <div className="flex gap-2">
                {endorsement.isApproved && <Badge variant="secondary">Approved</Badge>}
                {endorsement.isFeatured && (
                  <Badge className="gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-sm mb-4 italic">"{endorsement.testimonial}"</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{endorsement.date}</span>
              <div className="flex gap-2">
                {!endorsement.isApproved && (
                  <>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
                {endorsement.isApproved && !endorsement.isFeatured && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <Star className="h-4 w-4" />
                    Feature
                  </Button>
                )}
                {endorsement.isFeatured && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <X className="h-4 w-4" />
                    Unfeature
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
