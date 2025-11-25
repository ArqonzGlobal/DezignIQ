import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";

interface ProfessionalCardProps {
  name: string;
  title: string;
  rating: number;
  reviews: number;
  location: string;
  price: string;
  image: string;
  onClick?: () => void;
}

export const ProfessionalCard = ({
  name,
  title,
  rating,
  reviews,
  location,
  price,
  image,
  onClick,
}: ProfessionalCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={image}
            alt={name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-xs text-muted-foreground">({reviews})</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{location}</span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Starting from</span>
            <p className="text-lg font-bold text-foreground">{price}</p>
          </div>
          <Button size="sm" className="bg-amber-700 hover:bg-amber-800 text-white" onClick={onClick}>
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
