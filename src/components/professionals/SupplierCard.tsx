import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface SupplierCardProps {
  name: string;
  category: string;
  location: string;
  image: string;
  description: string;
}

export const SupplierCard = ({
  name,
  category,
  location,
  image,
  description,
}: SupplierCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2">
          {category}
        </Badge>
        <h3 className="font-bold text-foreground mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{location}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          Explore Now →
        </Button>
      </CardContent>
    </Card>
  );
};
