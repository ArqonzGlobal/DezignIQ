import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "@/components/projects/ProjectCard";

const projectsData = [
  {
    id: "1",
    title: "Modern Villa Design",
    description: "Contemporary residential villa with sustainable features",
    location: "Mumbai, 400001",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    completionDate: "2024",
  },
  {
    id: "2",
    title: "Corporate Office Tower",
    description: "25-story commercial building with smart facilities",
    location: "Bangalore, 560001",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    completionDate: "2023",
  },
  {
    id: "3",
    title: "Luxury Apartment Complex",
    description: "Premium residential development with world-class amenities",
    location: "Delhi, 110001",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    completionDate: "2024",
  },
  {
    id: "4",
    title: "Shopping Mall Renovation",
    description: "Complete redesign of retail space with modern aesthetic",
    location: "Pune, 411001",
    image: "https://images.unsplash.com/photo-1555529669-2269763671c0?w=800&h=600&fit=crop",
    completionDate: "2023",
  },
  {
    id: "5",
    title: "Eco-Friendly Resort",
    description: "Sustainable hospitality project with natural materials",
    location: "Goa, 403001",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    completionDate: "2024",
  },
  {
    id: "6",
    title: "Industrial Warehouse",
    description: "Large-scale storage facility with modern infrastructure",
    location: "Chennai, 600001",
    image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&h=600&fit=crop",
    completionDate: "2023",
  },
];

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Explore our portfolio of completed architectural and construction projects
          </p>
          <Button 
            onClick={() => navigate("/projects/listing")}
            variant="outline"
            size="lg"
          >
            Search Projects by Location
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onClick={() => navigate("/projects/listing")}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
