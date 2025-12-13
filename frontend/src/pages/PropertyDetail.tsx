import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, ArrowLeft, Bed, Bath, Square, Car, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const propertiesData: Record<string, any> = {
  "1": {
    id: "1",
    title: "Luxury Apartment in Downtown",
    description: "Experience luxury living in this stunning 3BHK apartment located in the heart of downtown Mumbai. This property features premium finishes, modern amenities, and breathtaking city views. The apartment includes a spacious living area, contemporary kitchen with high-end appliances, and elegant bathrooms. Perfect for those seeking comfort and convenience in an urban setting.",
    location: "Downtown Mumbai, 400001",
    price: "₹2.5 Cr",
    type: "buy",
    propertyType: "Apartment",
    bannerImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185127-6a7e50c6b2d1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop",
    ],
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: "1,800 sq ft",
      parking: "2 Cars",
    },
    amenities: [
      "24/7 Security",
      "Swimming Pool",
      "Gymnasium",
      "Children's Play Area",
      "Power Backup",
      "Lift",
      "Club House",
      "Landscaped Garden",
    ],
  },
  "2": {
    id: "2",
    title: "Spacious Villa with Garden",
    description: "Beautiful 4BHK independent villa with landscaped garden in prime Bangalore location. This luxurious property offers ample space for comfortable family living with modern architecture and premium construction quality. Features include a private garden, terrace, and contemporary interiors designed for elegant living.",
    location: "Whitefield, Bangalore, 560001",
    price: "₹4.2 Cr",
    type: "buy",
    propertyType: "Villa",
    bannerImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: "3,200 sq ft",
      parking: "3 Cars",
    },
    amenities: [
      "Private Garden",
      "Terrace",
      "Modular Kitchen",
      "Home Automation",
      "Security System",
      "Solar Panels",
      "Servant Room",
      "Store Room",
    ],
  },
};

export default function PropertyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const property = id ? propertiesData[id] : null;

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Enquiry submitted successfully! We'll contact you soon.");
    setIsEnquiryOpen(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
          <Button onClick={() => navigate("/properties")}>
            Back to Properties
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
          onClick={() => navigate("/properties/listing")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Button>

        {/* Banner Image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <img
            src={property.bannerImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className="text-lg px-4 py-2 bg-primary text-primary-foreground">
              {property.price}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Location */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>

            {/* Key Features */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Key Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Bed className="w-6 h-6 mb-2 text-primary" />
                    <span className="font-semibold text-foreground">{property.features.bedrooms}</span>
                    <span className="text-sm text-muted-foreground">Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Bath className="w-6 h-6 mb-2 text-primary" />
                    <span className="font-semibold text-foreground">{property.features.bathrooms}</span>
                    <span className="text-sm text-muted-foreground">Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Square className="w-6 h-6 mb-2 text-primary" />
                    <span className="font-semibold text-foreground">{property.features.area}</span>
                    <span className="text-sm text-muted-foreground">Area</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Car className="w-6 h-6 mb-2 text-primary" />
                    <span className="font-semibold text-foreground">{property.features.parking}</span>
                    <span className="text-sm text-muted-foreground">Parking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="justify-start text-left py-2 px-3"
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Property Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.gallery.map((image: string, index: number) => (
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
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Property Price</p>
                  <p className="text-3xl font-bold text-foreground">{property.price}</p>
                </div>

                <Dialog open={isEnquiryOpen} onOpenChange={setIsEnquiryOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-3" size="lg">
                      <Mail className="w-4 h-4 mr-2" />
                      Enquire Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Enquiry</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEnquirySubmit} className="space-y-4">
                      <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      <Input
                        type="tel"
                        placeholder="Your Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                      <Textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                      />
                      <Button type="submit" className="w-full">
                        Submit Enquiry
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Owner
                </Button>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Property Type</p>
                  <Badge variant="secondary" className="mb-4">{property.propertyType}</Badge>
                  
                  <p className="text-sm text-muted-foreground mb-2">Listed For</p>
                  <Badge variant="secondary" className="capitalize">{property.type}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
