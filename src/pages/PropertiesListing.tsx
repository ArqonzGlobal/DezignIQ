import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropertyCard } from "@/components/properties/PropertyCard";

const allProperties = [
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
  {
    id: "7",
    title: "Luxury Penthouse",
    description: "Exclusive penthouse with panoramic views",
    location: "Mumbai, 400001",
    price: "₹8.5 Cr",
    type: "buy",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    propertyType: "Apartment",
  },
  {
    id: "8",
    title: "Office Space for Rent",
    description: "Modern office space in business hub",
    location: "Bangalore, 560001",
    price: "₹1.5L/month",
    type: "rent",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    propertyType: "Commercial",
  },
];

export default function PropertiesListing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("all");
  const [activeTab, setActiveTab] = useState("buy");

  const filterProperties = (type: string) => {
    let filtered = allProperties.filter((property) => property.type === type);
    
    if (searchQuery) {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedPropertyType !== "all") {
      filtered = filtered.filter((property) => 
        property.propertyType === selectedPropertyType
      );
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Property Listings
          </h1>
          <p className="text-muted-foreground">
            Find your perfect property from our extensive collection
          </p>
        </div>

        {/* Tabs for Buy/Sell/Rent */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
            <TabsTrigger value="rent">Rent</TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by location or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Individual House">Individual House</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Plot">Plot</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="buy" className="mt-6">
            <PropertyResults 
              properties={filterProperties("buy")} 
              navigate={navigate}
            />
          </TabsContent>

          <TabsContent value="sell" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Want to Sell Your Property?
              </h3>
              <p className="text-muted-foreground mb-6">
                List your property with us and reach thousands of potential buyers
              </p>
              <Button size="lg">List Your Property</Button>
            </div>
          </TabsContent>

          <TabsContent value="rent" className="mt-6">
            <PropertyResults 
              properties={filterProperties("rent")} 
              navigate={navigate}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function PropertyResults({ properties, navigate }: { properties: any[], navigate: any }) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No properties found matching your criteria
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            {...property}
            onClick={() => navigate(`/properties/${property.id}`)}
          />
        ))}
      </div>
    </>
  );
}
