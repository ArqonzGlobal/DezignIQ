import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export default function SampleDataGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSampleData = async () => {
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in first");
        return;
      }

      // Sample Products
      const products = [
        { name: "Portland Cement 50kg", category: "Cement", price: 450, description: "High-grade Portland cement suitable for all construction needs", tags: ["cement", "construction", "building"], images: ["https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=400"] },
        { name: "TMT Steel Bars 12mm", category: "Steel", price: 52000, description: "Thermo-Mechanically Treated steel bars for reinforcement", tags: ["steel", "reinforcement", "tmt"], images: ["https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400"] },
        { name: "Red Clay Bricks", category: "Bricks", price: 8, description: "Traditional red clay bricks, per piece", tags: ["bricks", "clay", "masonry"], images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400"] },
        { name: "Premium Granite Tiles 60x60cm", category: "Flooring", price: 125, description: "Polished granite tiles for elegant flooring", tags: ["tiles", "granite", "flooring"], images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400"] },
        { name: "PVC Pipes 2 inch", category: "Plumbing", price: 85, description: "Durable PVC pipes for water supply", tags: ["plumbing", "pipes", "pvc"], images: ["https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400"] },
        { name: "LED Panel Lights 40W", category: "Electrical", price: 850, description: "Energy-efficient LED panel lights", tags: ["lighting", "led", "electrical"], images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400"] },
        { name: "Waterproof Paint 20L", category: "Paint", price: 3200, description: "Exterior waterproof emulsion paint", tags: ["paint", "waterproof", "exterior"], images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400"] },
        { name: "Plywood 18mm", category: "Wood", price: 2800, description: "Marine grade plywood sheet 8x4 ft", tags: ["plywood", "wood", "marine"], images: ["https://images.unsplash.com/photo-1551127481-43279ba57321?w=400"] },
        { name: "Aluminum Windows", category: "Windows", price: 12500, description: "Sliding aluminum windows with glass", tags: ["windows", "aluminum", "sliding"], images: ["https://images.unsplash.com/photo-1559599746-7bfb7fdc3c86?w=400"] },
        { name: "Marble Stone White", category: "Stone", price: 180, description: "Premium white marble per sq ft", tags: ["marble", "stone", "white"], images: ["https://images.unsplash.com/photo-1620126337162-e0a2600cbc5e?w=400"] },
        { name: "Electrical Wires 2.5mm", category: "Electrical", price: 2400, description: "Copper electrical wiring per roll", tags: ["wires", "copper", "electrical"], images: ["https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400"] },
        { name: "Sand (River) per ton", category: "Aggregates", price: 1800, description: "Fine river sand for construction", tags: ["sand", "aggregates", "river"], images: ["https://images.unsplash.com/photo-1581087712134-e9f7f6f0ba8b?w=400"] },
      ];

      const { error: productsError } = await supabase.from("products").insert(
        products.map(p => ({ ...p, user_id: user.id, status: "active" }))
      );
      if (productsError) throw productsError;

      // Sample Projects
      const projects = [
        { title: "Modern Villa Construction", description: "Luxury 3-bedroom villa with contemporary design", location: "Gurgaon, Haryana", client_name: "Mr. Sharma", project_cost: 12500000, status: "ongoing", start_date: "2024-01-15", end_date: "2025-03-30", tags: ["villa", "luxury", "residential"], images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"] },
        { title: "Commercial Complex", description: "5-floor commercial building with retail spaces", location: "Mumbai, Maharashtra", client_name: "ABC Properties", project_cost: 45000000, status: "completed", start_date: "2023-06-01", end_date: "2024-11-15", tags: ["commercial", "retail", "complex"], images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600"] },
        { title: "Apartment Renovation", description: "Complete interior renovation of 3BHK apartment", location: "Bangalore, Karnataka", client_name: "Mrs. Reddy", project_cost: 2800000, status: "completed", start_date: "2024-08-01", end_date: "2024-10-30", tags: ["renovation", "apartment", "interior"], images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"] },
        { title: "Farm House Development", description: "Eco-friendly farmhouse with sustainable features", location: "Pune, Maharashtra", client_name: "Green Living Trust", project_cost: 8500000, status: "ongoing", start_date: "2024-05-01", end_date: "2025-01-15", tags: ["farmhouse", "eco-friendly", "sustainable"], images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600"] },
        { title: "Industrial Warehouse", description: "Large storage facility with modern amenities", location: "Ahmedabad, Gujarat", client_name: "XYZ Logistics", project_cost: 35000000, status: "upcoming", start_date: "2025-02-01", end_date: "2025-12-31", tags: ["warehouse", "industrial", "logistics"], images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600"] },
        { title: "School Building", description: "3-story school building with 40 classrooms", location: "Delhi", client_name: "Education Board", project_cost: 28000000, status: "completed", start_date: "2023-01-15", end_date: "2024-06-30", tags: ["school", "education", "institutional"], images: ["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600"] },
        { title: "Bungalow Construction", description: "Traditional style bungalow with garden", location: "Jaipur, Rajasthan", client_name: "Mr. Patel", project_cost: 7500000, status: "ongoing", start_date: "2024-09-01", end_date: "2025-04-30", tags: ["bungalow", "traditional", "residential"], images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600"] },
        { title: "Restaurant Interior", description: "Fine dining restaurant complete interior design", location: "Kolkata, West Bengal", client_name: "Gourmet Delights", project_cost: 4200000, status: "completed", start_date: "2024-06-15", end_date: "2024-09-30", tags: ["restaurant", "interior", "commercial"], images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"] },
        { title: "Hospital Wing", description: "New wing addition to existing hospital", location: "Chennai, Tamil Nadu", client_name: "City Hospital", project_cost: 52000000, status: "ongoing", start_date: "2024-03-01", end_date: "2025-09-30", tags: ["hospital", "healthcare", "institutional"], images: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600"] },
        { title: "Duplex House", description: "Modern duplex with rooftop garden", location: "Hyderabad, Telangana", client_name: "Mr. Kumar", project_cost: 9500000, status: "upcoming", start_date: "2025-01-15", end_date: "2025-10-31", tags: ["duplex", "modern", "residential"], images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600"] },
      ];

      const { error: projectsError } = await supabase.from("projects").insert(
        projects.map(p => ({ ...p, user_id: user.id }))
      );
      if (projectsError) throw projectsError;

      // Sample Properties
      const properties = [
        { title: "Luxury Penthouse", description: "4BHK penthouse with panoramic city views", location: "South Delhi", property_type: "apartment", listing_type: "sale", price: 65000000, area_sqft: 3500, bedrooms: 4, bathrooms: 4, status: "active", tags: ["luxury", "penthouse", "city-view"], images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"] },
        { title: "Commercial Office Space", description: "Premium office space in business district", location: "Gurgaon Cyber City", property_type: "commercial", listing_type: "rent", price: 250000, area_sqft: 2000, status: "active", tags: ["office", "commercial", "premium"], images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=600"] },
        { title: "Garden Villa", description: "Spacious 5BHK villa with large garden", location: "Whitefield, Bangalore", property_type: "villa", listing_type: "sale", price: 42000000, area_sqft: 4200, bedrooms: 5, bathrooms: 5, status: "active", tags: ["villa", "garden", "spacious"], images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"] },
        { title: "Studio Apartment", description: "Modern studio perfect for young professionals", location: "Andheri West, Mumbai", property_type: "apartment", listing_type: "rent", price: 35000, area_sqft: 450, bedrooms: 1, bathrooms: 1, status: "active", tags: ["studio", "modern", "compact"], images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"] },
        { title: "Retail Shop", description: "Prime location shop in busy market", location: "Connaught Place, Delhi", property_type: "commercial", listing_type: "rent", price: 180000, area_sqft: 800, status: "active", tags: ["retail", "shop", "prime-location"], images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"] },
        { title: "Farmhouse Plot", description: "Agricultural land with water supply", location: "Lonavala, Maharashtra", property_type: "land", listing_type: "sale", price: 8500000, area_sqft: 21780, status: "active", tags: ["farmhouse", "land", "agricultural"], images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600"] },
        { title: "3BHK Apartment", description: "Well-maintained apartment in gated society", location: "Kharadi, Pune", property_type: "apartment", listing_type: "sale", price: 8500000, area_sqft: 1450, bedrooms: 3, bathrooms: 2, status: "active", tags: ["apartment", "gated-society", "family"], images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"] },
        { title: "Warehouse", description: "Large storage facility near highway", location: "Manesar, Haryana", property_type: "commercial", listing_type: "rent", price: 320000, area_sqft: 15000, status: "active", tags: ["warehouse", "storage", "industrial"], images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600"] },
        { title: "Beach Villa", description: "Stunning villa with private beach access", location: "Goa", property_type: "villa", listing_type: "sale", price: 95000000, area_sqft: 5000, bedrooms: 6, bathrooms: 6, status: "active", tags: ["beach", "villa", "luxury"], images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600"] },
        { title: "2BHK Builder Floor", description: "Independent builder floor with parking", location: "Vasant Kunj, Delhi", property_type: "apartment", listing_type: "sale", price: 18500000, area_sqft: 1200, bedrooms: 2, bathrooms: 2, status: "active", tags: ["builder-floor", "independent", "parking"], images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600"] },
      ];

      const { error: propertiesError } = await supabase.from("properties").insert(
        properties.map(p => ({ ...p, user_id: user.id }))
      );
      if (propertiesError) throw propertiesError;

      // Sample Requirements
      const requirements = [
        { item_description: "50 tons of cement", quantity: 50, specifications: "Grade 53 Portland cement", timeline: "Within 2 weeks", location: "Delhi NCR", status: "pending" },
        { item_description: "TMT Steel bars", quantity: 20, specifications: "12mm and 16mm mix, Fe 500D grade", timeline: "Urgent - 5 days", location: "Mumbai", status: "active" },
        { item_description: "Granite tiles", quantity: 500, specifications: "60x60cm polished, various colors", timeline: "1 month", location: "Bangalore", status: "pending" },
        { item_description: "PVC pipes and fittings", quantity: 1000, specifications: "2 inch and 4 inch diameter", timeline: "2 weeks", location: "Pune", status: "active" },
        { item_description: "Electrical cables", quantity: 100, specifications: "Copper wires, various gauges", timeline: "10 days", location: "Hyderabad", status: "pending" },
        { item_description: "Paint materials", quantity: 200, specifications: "Exterior emulsion and primer", timeline: "Immediate", location: "Chennai", status: "completed" },
        { item_description: "Plywood sheets", quantity: 150, specifications: "18mm marine grade", timeline: "3 weeks", location: "Kolkata", status: "active" },
        { item_description: "Glass panels", quantity: 80, specifications: "Tempered glass 10mm", timeline: "15 days", location: "Ahmedabad", status: "pending" },
        { item_description: "Aluminum sections", quantity: 300, specifications: "For windows and doors", timeline: "1 week", location: "Jaipur", status: "active" },
        { item_description: "Marble slabs", quantity: 100, specifications: "White Italian marble", timeline: "1 month", location: "Gurgaon", status: "pending" },
      ];

      const { error: requirementsError } = await supabase.from("requirements").insert(
        requirements.map(r => ({ ...r, user_id: user.id }))
      );
      if (requirementsError) throw requirementsError;

      // Sample Professional Profile
      const { error: professionalError } = await supabase.from("professionals").upsert({
        user_id: user.id,
        specialization: "Residential & Commercial Architecture",
        bio: "Award-winning architect with 15+ years of experience in sustainable design and modern architecture. Specialized in residential villas, commercial complexes, and institutional buildings.",
        skill_sets: ["Architectural Design", "3D Modeling", "AutoCAD", "Revit", "Project Management", "Sustainable Design", "Interior Design", "Landscape Architecture"],
        completed_projects: 150,
        rate: 2500,
        pricing_type: "Per project",
        profile_photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
      });
      if (professionalError) throw professionalError;

      toast.success("Sample data generated successfully!");
    } catch (error: any) {
      console.error("Error generating sample data:", error);
      toast.error("Failed to generate sample data: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sample Data Generator</h1>
        <p className="text-muted-foreground">Generate sample data to test your profile sections</p>
      </div>

      <Card className="p-6">
        <div className="text-center space-y-4">
          <Database className="h-16 w-16 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Generate Test Data</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This will create sample products, projects, properties, and requirements for testing purposes. 
            You can delete them later from their respective management pages.
          </p>
          <Button 
            onClick={generateSampleData} 
            disabled={isGenerating}
            size="lg"
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Generate Sample Data
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">What will be created:</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• 12 sample products (cement, steel, tiles, etc.)</li>
          <li>• 10 sample projects (villas, apartments, commercial)</li>
          <li>• 10 sample properties (apartments, villas, commercial)</li>
          <li>• 10 sample requirements (material needs)</li>
          <li>• Your professional profile</li>
        </ul>
      </Card>
    </div>
  );
}
