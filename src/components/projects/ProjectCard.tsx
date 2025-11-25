import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  location: string;
  image: string;
  completionDate: string;
  onClick?: () => void;
}

export const ProjectCard = ({
  title,
  description,
  location,
  image,
  completionDate,
  onClick,
}: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer" onClick={onClick}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Completed: {completionDate}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          View Details →
        </Button>
      </CardContent>
    </Card>
  );
};
