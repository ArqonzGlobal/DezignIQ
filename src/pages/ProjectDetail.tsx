import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";

const projectsData: Record<string, any> = {
  "1": {
    id: "1",
    title: "Modern Villa Design",
    description: "A stunning contemporary residential villa that seamlessly blends luxury with sustainability. This project showcases innovative architectural design with eco-friendly features including solar panels, rainwater harvesting, and natural ventilation systems.",
    location: "Mumbai, 400001",
    completionDate: "March 2024",
    bannerImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
    features: [
      "Built-up Area: 5,500 sq ft",
      "4 Bedrooms + Study",
      "Solar Power System",
      "Rainwater Harvesting",
      "Smart Home Automation",
      "Landscaped Garden",
    ],
  },
  "2": {
    id: "2",
    title: "Corporate Office Tower",
    description: "A prestigious 25-story commercial building featuring state-of-the-art facilities and smart building technology. The design prioritizes energy efficiency, employee wellness, and modern work culture.",
    location: "Bangalore, 560001",
    completionDate: "December 2023",
    bannerImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    ],
    features: [
      "Total Area: 450,000 sq ft",
      "25 Floors",
      "LEED Gold Certified",
      "High-Speed Elevators",
      "Premium Amenities",
      "24/7 Security",
    ],
  },
};

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const project = id ? projectsData[id] : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/projects")}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/projects")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        {/* Banner Image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <img
            src={project.bannerImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{project.title}</h1>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Completed: {project.completionDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">About This Project</h2>
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Project Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {project.gallery.map((image: string, index: number) => (
                    <div
                      key={index}
                      className="relative h-48 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Key Features</h2>
                <div className="space-y-3">
                  {project.features.map((feature: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="w-full justify-start text-left py-2 px-3"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <Button className="w-full" size="lg">
                    Contact for Similar Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
