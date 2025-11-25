import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface PortfolioCardProps {
  name: string;
  type: string;
  rating: number;
  image: string;
  description: string;
}

export const PortfolioCard = ({
  name,
  type,
  rating,
  image,
  description,
}: PortfolioCardProps) => {
  return (
    <Card className="overflow-hidden bg-white hover:shadow-xl transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-foreground text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-amber-100 text-amber-900 hover:bg-amber-200">
            {type}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium text-foreground">{rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
