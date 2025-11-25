import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface PropertyCardProps {
  title: string;
  description: string;
  location: string;
  price: string;
  image: string;
  propertyType: string;
  onClick?: () => void;
}

export const PropertyCard = ({
  title,
  description,
  location,
  price,
  image,
  propertyType,
  onClick,
}: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={onClick}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground shadow-lg">
            {price}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="mb-3">
          <Badge variant="secondary" className="mb-2">
            {propertyType}
          </Badge>
          <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{location}</span>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          View Details →
        </Button>
      </CardContent>
    </Card>
  );
};
