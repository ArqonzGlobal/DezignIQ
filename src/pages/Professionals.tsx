import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfessionalCard } from "@/components/professionals/ProfessionalCard";
import { PortfolioCard } from "@/components/professionals/PortfolioCard";
import { SupplierCard } from "@/components/professionals/SupplierCard";
import { Search } from "lucide-react";

const Professionals = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for professionals
  const architects = [
    { id: 1, name: "Arjun Das", title: "Architect", rating: 4.8, reviews: 124, location: "Mumbai, Maharashtra", price: "₹500", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop" },
    { id: 2, name: "Priya Sharma", title: "Senior Architect", rating: 4.9, reviews: 98, location: "Delhi, NCR", price: "₹750", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop" },
    { id: 3, name: "Rahul Verma", title: "Lead Architect", rating: 4.7, reviews: 156, location: "Bangalore, Karnataka", price: "₹600", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop" },
  ];

  const designers = [
    { id: 4, name: "Neha Patel", title: "Interior Designer", rating: 4.9, reviews: 203, location: "Ahmedabad, Gujarat", price: "₹450", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop" },
    { id: 5, name: "Vikram Singh", title: "3D Designer", rating: 4.6, reviews: 87, location: "Pune, Maharashtra", price: "₹400", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
    { id: 6, name: "Anjali Reddy", title: "Design Consultant", rating: 4.8, reviews: 145, location: "Hyderabad, Telangana", price: "₹550", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&h=150&fit=crop" },
  ];

  const engineers = [
    { id: 7, name: "Amit Kumar", title: "Structural Engineer", rating: 4.9, reviews: 167, location: "Chennai, Tamil Nadu", price: "₹650", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { id: 8, name: "Sanjay Mehta", title: "Civil Engineer", rating: 4.7, reviews: 134, location: "Kolkata, West Bengal", price: "₹500", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { id: 9, name: "Deepak Joshi", title: "Project Engineer", rating: 4.8, reviews: 192, location: "Jaipur, Rajasthan", price: "₹550", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" },
  ];

  const commercialPros = [
    { id: 10, name: "Sara Johnson", title: "Commercial Architect", rating: 4.9, reviews: 234, location: "Mumbai, Maharashtra", price: "₹800", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop" },
    { id: 11, name: "Mike Anderson", title: "Retail Designer", rating: 4.8, reviews: 178, location: "Bangalore, Karnataka", price: "₹700", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop" },
    { id: 12, name: "Lisa Williams", title: "Office Designer", rating: 4.7, reviews: 145, location: "Delhi, NCR", price: "₹650", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop" },
    { id: 13, name: "John Davis", title: "Commercial Planner", rating: 4.9, reviews: 201, location: "Pune, Maharashtra", price: "₹750", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop" },
  ];

  const teams = [
    { id: 14, name: "Harshit Studio", title: "Architecture Team", rating: 4.9, reviews: 89, location: "Mumbai, Maharashtra", price: "₹2000", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop" },
    { id: 15, name: "Design Collective", title: "Interior Design Team", rating: 4.8, reviews: 67, location: "Bangalore, Karnataka", price: "₹1800", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=150&h=150&fit=crop" },
    { id: 16, name: "Build Masters", title: "Construction Team", rating: 4.7, reviews: 103, location: "Delhi, NCR", price: "₹2200", image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=150&h=150&fit=crop" },
    { id: 17, name: "Elite Engineers", title: "Engineering Team", rating: 4.9, reviews: 124, location: "Chennai, Tamil Nadu", price: "₹1900", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=150&h=150&fit=crop" },
  ];

  const portfolios = [
    { id: 1, name: "Avarage studio", type: "Architecture", rating: 4.9, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop", description: "Modern residential designs" },
    { id: 2, name: "Home", type: "Interior Design", rating: 4.8, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop", description: "Luxury home interiors" },
    { id: 3, name: "Anurag Gaikwad", type: "Commercial", rating: 4.7, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop", description: "Office space transformation" },
  ];

  const suppliers = [
    { id: 1, name: "Manufacturers", category: "Building Materials", location: "Mumbai, Maharashtra", image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&h=200&fit=crop", description: "Premium quality bricks and concrete blocks" },
    { id: 2, name: "Steel Makers", category: "Metal & Steel", location: "Bangalore, Karnataka", image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=300&h=200&fit=crop", description: "Industrial grade steel supplies" },
    { id: 3, name: "Wood Works", category: "Timber & Wood", location: "Delhi, NCR", image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=300&h=200&fit=crop", description: "Sustainable wood materials" },
    { id: 4, name: "Glass Solutions", category: "Glass & Windows", location: "Pune, Maharashtra", image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=300&h=200&fit=crop", description: "Custom glass fabrication" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=500&fit=crop')" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Hire trusted Professional for your projects
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find qualified architects & design professionals. Get Instant Labor for your construction. Incredibly easy for you and profitable.
          </p>
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search professionals..."
                className="pl-10 h-12 bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              size="lg" 
              className="h-12 px-8"
              onClick={() => navigate("/professionals/listing")}
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Recommended Professionals */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Recommended <span className="text-primary">Professionals</span>
        </h2>
        
        <Tabs defaultValue="architects" className="mb-8">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3">
            <TabsTrigger value="architects">Connect with Architects</TabsTrigger>
            <TabsTrigger value="designers">Designers for you</TabsTrigger>
            <TabsTrigger value="engineers">Engineers near You</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {architects.map((pro) => (
            <ProfessionalCard key={pro.id} {...pro} onClick={() => navigate("/professionals/listing")} />
          ))}
        </div>
      </section>

      {/* Trusted Commercial Pros */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-accent/10 rounded-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Trusted <span className="text-primary">Commercials Pros</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {commercialPros.map((pro) => (
            <ProfessionalCard key={pro.id} {...pro} onClick={() => navigate("/professionals/listing")} />
          ))}
        </div>
      </section>

      {/* Build with Best Teams */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Build with the <span className="text-primary">Best Teams</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team) => (
            <ProfessionalCard key={team.id} {...team} onClick={() => navigate("/professionals/listing")} />
          ))}
        </div>
      </section>

      {/* Featured Portfolios */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-amber-700 to-amber-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Featured Portfolios
          </h2>
          <p className="text-center text-amber-100 mb-12">
            To let tryout through proof of work.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id} {...portfolio} />
            ))}
          </div>
        </div>
      </section>

      {/* Showcased Suppliers */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Showcased <span className="text-primary">Suppliers</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.id} {...supplier} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Professionals;
