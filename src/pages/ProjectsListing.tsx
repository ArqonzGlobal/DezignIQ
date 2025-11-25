import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "@/components/projects/ProjectCard";

const allProjects = [
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

export default function ProjectsListing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = allProjects.filter((project) =>
    project.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            Search Projects by Location
          </h1>
          <p className="text-muted-foreground mb-6 text-center">
            Find projects in your area by entering city name or pincode
          </p>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter location (e.g., Mumbai, 400001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="default">Search</Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                {...project}
                onClick={() => navigate(`/projects/${project.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No projects found in this location
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
