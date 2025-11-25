import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useState } from "react";

const featuredProperties = [
  {
    id: "1",
    title: "Luxury Apartment in Downtown",
    description: "Modern 3BHK with premium amenities and city views",
    location: "Mumbai, 400001",
    price: "₹2.5 Cr",
    type: "buy",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    propertyType: "Apartment",
  },
  {
    id: "2",
    title: "Spacious Villa with Garden",
    description: "Beautiful 4BHK villa with landscaped garden",
    location: "Bangalore, 560001",
    price: "₹4.2 Cr",
    type: "buy",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    propertyType: "Villa",
  },
  {
    id: "3",
    title: "Prime Commercial Plot",
    description: "Corner plot in developing business district",
    location: "Pune, 411001",
    price: "₹1.8 Cr",
    type: "buy",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
    propertyType: "Plot",
  },
  {
    id: "4",
    title: "Cozy 2BHK for Rent",
    description: "Fully furnished apartment in prime location",
    location: "Delhi, 110001",
    price: "₹35,000/month",
    type: "rent",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    propertyType: "Apartment",
  },
  {
    id: "5",
    title: "Independent House",
    description: "Spacious 3BHK house with parking",
    location: "Chennai, 600001",
    price: "₹3.1 Cr",
    type: "buy",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    propertyType: "Individual House",
  },
  {
    id: "6",
    title: "Modern Studio Apartment",
    description: "Compact living space with all amenities",
    location: "Goa, 403001",
    price: "₹25,000/month",
    type: "rent",
    image: "https://images.unsplash.com/photo-1502672260066-6bc85c2ab07b?w=800&h=600&fit=crop",
    propertyType: "Apartment",
  },
];

export default function Properties() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = featuredProperties.filter((property) =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Dream Property
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Discover the perfect property from our curated collection
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by location or property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button 
                size="lg"
                onClick={() => navigate("/properties/listing")}
              >
                Search
              </Button>
            </div>
          </div>

          <Button 
            onClick={() => navigate("/properties/listing")}
            variant="outline"
            size="lg"
          >
            Browse All Properties
          </Button>
        </div>

        {/* Featured Properties Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Featured Properties</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
              onClick={() => navigate("/properties/listing")}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
