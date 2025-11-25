import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, CheckCircle } from "lucide-react";

const mockReviews = [
  {
    id: "1",
    customerName: "Rajesh Verma",
    rating: 5,
    comment: "Outstanding service! Highly professional and delivered exactly what we needed.",
    isVerified: true,
    isFeatured: true,
    reply: "Thank you for your kind words!",
    date: "2024-01-08",
  },
  {
    id: "2",
    customerName: "Meera Singh",
    rating: 4,
    comment: "Good work overall. Minor delays but the final result was worth it.",
    isVerified: true,
    isFeatured: false,
    reply: null,
    date: "2024-01-10",
  },
];

export default function KYCManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Know Your Customer (KYC)</h1>
        <p className="text-muted-foreground">Customer reviews and feedback</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold">4.8</p>
            <div className="flex justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold">127</p>
            <p className="text-sm text-muted-foreground mt-2">Total Reviews</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold">98%</p>
            <p className="text-sm text-muted-foreground mt-2">Verified Reviews</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {mockReviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{review.customerName}</h3>
                  {review.isVerified && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                {review.isFeatured && (
                  <Badge className="gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            </div>

            <p className="text-sm mb-3">{review.comment}</p>

            {review.reply && (
              <div className="bg-muted p-3 rounded-lg mb-3">
                <p className="text-xs font-semibold mb-1">Your Reply:</p>
                <p className="text-sm">{review.reply}</p>
              </div>
            )}

            <div className="flex gap-2">
              {!review.reply && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Reply
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reply to Review</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Customer Review</Label>
                        <p className="text-sm p-3 bg-muted rounded-lg mt-2">{review.comment}</p>
                      </div>
                      <div>
                        <Label htmlFor="reply">Your Reply</Label>
                        <Textarea id="reply" placeholder="Thank you for your feedback..." rows={4} />
                      </div>
                      <Button className="w-full">Send Reply</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {!review.isFeatured && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Star className="h-4 w-4" />
                  Feature
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
