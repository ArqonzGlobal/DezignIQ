import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Heart, Star, ChevronLeft, ChevronRight,SlidersHorizontal  } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/products/ProductCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { HorizontalScroll } from "@/components/products/HorizontalScroll";
import '@/styles/productListing.css'

const categories = [
  { name: "SAND", image: "https://images.unsplash.com/photo-1571126049861-80f81c5de5de?w=200" },
  { name: "BRICKS", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=200" },
  { name: "AGGREGATES", image: "https://images.unsplash.com/photo-1590934235308-a5693e4563e0?w=200" },
  { name: "STEEL", image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=200" },
  { name: "CEMENT", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200" },
  { name: "TMT BARS", image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=200" },
  { name: "CHANNELS", image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200" },
  { name: "WINDOWS", image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200" },
  { name: "DOORS", image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200" },
  { name: "WOOD", image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200" },
  { name: "TIMBER", image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200" },
  { name: "CONCRETE", image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200" },
  { name: "ALUMINIUM", image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200" },
  { name: "COPPER", image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200" },
  { name: "PIPES", image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200" },
];

const products = Array(12)
  .fill(null)
  .map((_, idx) => ({
    id: idx,
    title: "High-Strength Cement Bricks - Durable, Weather-Resistant, and Built for Tough Conditions.",
    price: "1,456",
    originalPrice: "1,850",
    discount: "20% off",
    moq: "10",
    rating: 4.5,
    image:
      idx % 3 === 0
        ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400"
        : `https://images.unsplash.com/photo-${1590934235308 + idx}?w=400`,
    verified: idx % 2 === 0,
  }));

export default function ProductListing() {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [activeCategory, setActiveCategory] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  function handleWishlistToggle(productId: any, isAdded: string): void {
    throw new Error("Function not implemented.");
  }
  
    const FilterContent = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Filters</h3>
        <Button variant="link" className="text-primary p-0 h-auto">
          Clear
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">CATEGORY</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cement">Cement</SelectItem>
              <SelectItem value="bricks">Bricks</SelectItem>
              <SelectItem value="steel">Steel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">BRAND</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brand1">Brand 1</SelectItem>
              <SelectItem value="brand2">Brand 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">PRICE RANGE (₹)</label>
          <Slider value={priceRange} onValueChange={setPriceRange} max={10000} step={100} className="mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">COUNTRY OF ORIGIN</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="india">India</SelectItem>
              <SelectItem value="china">China</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">AVAILABILITY</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instock">In Stock</SelectItem>
              <SelectItem value="outofstock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">SUPPLIER</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supplier1">Supplier 1</SelectItem>
              <SelectItem value="supplier2">Supplier 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(prev => prev === categoryName ? '' : categoryName);
  };

  

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Material Categories */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => scroll('left')}
              className="p-2 bg-primary rounded-full flex-shrink-0"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div 
              ref={scrollContainerRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeCategory === cat.name
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary border border-gray-500 text-secondary-foreground hover:bg-primary/80 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <button 
              onClick={() => scroll('right')}
              className="p-2 bg-primary rounded-full flex-shrink-0"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
          {/* Filters Sidebar */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar - Shows above 1024px */}
          <aside className="hidden lg:block">
            <Card>
              <CardContent className="p-0">
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main>
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="w-full overflow-x-auto justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="products"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger
                  value="suppliers"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Suppliers
                </TabsTrigger>
                <TabsTrigger
                  value="nearest"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Nearest Supplies
                </TabsTrigger>
                <TabsTrigger
                  value="verified"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Verified Suppliers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    Showing 4,000+ products from global suppliers for "Cement"
                  </p>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-col-3  xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard 
                      productId={"/"+product.id} 
                      productName={product.title}
                      originalPrice={2000}
                      offerPrice={1000}
                      offerPercentage={50}
                      rating={product.rating}
                      productImage={product.image} 
                      moq={typeof product.moq === "string" ? (parseInt(product.moq) || 0) : (product.moq as number)}
                      onNavigate={() => navigate(product.id)}
                      onWishlistToggle={(isAdded) => handleWishlistToggle(product.id, isAdded)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="suppliers">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Showing 200+ verified suppliers for "Cement"</p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      id: 1,
                      name: "Nandi Plastic Cement stores",
                      type: "Retailer Store",
                      verified: true,
                      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
                      categories: "Blocks | Cement | Gravel | Construction & Civil Works",
                      products: [
                        {
                          name: "High-Quality Gravel",
                          moq: "10",
                          price: "1,456",
                          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
                        },
                        {
                          name: "Premium Cement",
                          moq: "10",
                          price: "1,456",
                          image: "https://images.unsplash.com/photo-1590934235308-a5693e4563e0?w=200",
                        },
                        {
                          name: "Construction Blocks",
                          moq: "10",
                          price: "1,456",
                          image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=200",
                        },
                        {
                          name: "Aggregate Stone",
                          moq: "10",
                          price: "1,456",
                          image: "https://images.unsplash.com/photo-1571126049861-80f81c5de5de?w=200",
                        },
                        {
                          name: "Building Material",
                          moq: "10",
                          price: "1,456",
                          image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=200",
                        },
                        {
                          name: "Quality Sand",
                          moq: "10",
                          price: "1,456",
                          image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=200",
                        },
                      ],
                    },
                    {
                      id: 2,
                      name: "BuildRight Construction Supplies",
                      type: "Wholesale Distributor",
                      verified: true,
                      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400",
                      categories: "Steel | TMT Bars | Cement | Bricks",
                      products: [
                        {
                          name: "TMT Steel Bars",
                          moq: "20",
                          price: "2,850",
                          image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=200",
                        },
                        {
                          name: "Red Bricks",
                          moq: "100",
                          price: "850",
                          image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=200",
                        },
                        {
                          name: "Portland Cement",
                          moq: "10",
                          price: "1,650",
                          image: "https://images.unsplash.com/photo-1590934235308-a5693e4563e0?w=200",
                        },
                        {
                          name: "Steel Channels",
                          moq: "15",
                          price: "3,200",
                          image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200",
                        },
                        {
                          name: "Concrete Blocks",
                          moq: "50",
                          price: "1,100",
                          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
                        },
                        {
                          name: "Reinforcement Bars",
                          moq: "25",
                          price: "2,950",
                          image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=200",
                        },
                      ],
                    },
                    {
                      id: 3,
                      name: "Metro Building Materials Hub",
                      type: "Manufacturer & Supplier",
                      verified: true,
                      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400",
                      categories: "Aggregates | Sand | Gravel | Stone",
                      products: [
                        {
                          name: "River Sand",
                          moq: "1000",
                          price: "950",
                          image: "https://images.unsplash.com/photo-1571126049861-80f81c5de5de?w=200",
                        },
                        {
                          name: "Crushed Stone",
                          moq: "500",
                          price: "1,250",
                          image: "https://images.unsplash.com/photo-1590934235308-a5693e4563e0?w=200",
                        },
                        {
                          name: "M-Sand",
                          moq: "1000",
                          price: "1,050",
                          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
                        },
                        {
                          name: "Pea Gravel",
                          moq: "500",
                          price: "1,150",
                          image: "https://images.unsplash.com/photo-1571126049861-80f81c5de5de?w=200",
                        },
                        {
                          name: "Blue Metal",
                          moq: "500",
                          price: "1,350",
                          image: "https://images.unsplash.com/photo-1590934235308-a5693e4563e0?w=200",
                        },
                        {
                          name: "Coarse Sand",
                          moq: "1000",
                          price: "900",
                          image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=200",
                        },
                      ],
                    },
                    {
                      id: 4,
                      name: "Prime Steel & Cement Industries",
                      type: "Industrial Supplier",
                      verified: true,
                      image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400",
                      categories: "Steel | Iron | Metal Products | Construction Materials",
                      products: [
                        {
                          name: "Structural Steel",
                          moq: "10",
                          price: "4,500",
                          image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=200",
                        },
                        {
                          name: "Iron Rods",
                          moq: "20",
                          price: "2,750",
                          image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=200",
                        },
                        {
                          name: "Metal Sheets",
                          moq: "15",
                          price: "3,850",
                          image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200",
                        },
                        {
                          name: "Wire Mesh",
                          moq: "25",
                          price: "1,650",
                          image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=200",
                        },
                        {
                          name: "Steel Beams",
                          moq: "10",
                          price: "5,200",
                          image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=200",
                        },
                        {
                          name: "Metal Angles",
                          moq: "30",
                          price: "2,100",
                          image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=200",
                        },
                      ],
                    },
                  ].map((supplier) => (
                    <Card key={supplier.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Store Image */}
                          <div className="w-full lg:w-48 h-48 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover" />
                          </div>

                          {/* Store Details & Products */}
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-xl font-bold">{supplier.name}</h3>
                                  {supplier.verified && (
                                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                      <span className="text-white text-xs">✓</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{supplier.type}</p>
                                <p className="text-xs text-muted-foreground">{supplier.categories}</p>
                              </div>
                              <Button className="whitespace-nowrap">Chat with Supplier</Button>
                            </div>

                            {/* Products Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-1  md:grid-cols-4 gap-3">
                              {supplier.products.map((product, idx) => (
                                <div key={idx} className="bg-muted rounded-lg p-2 space-y-2">
                                  <div className="aspect-square bg-background rounded overflow-hidden">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-xs line-clamp-2 mb-1">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">MOQ: {product.moq}</p>
                                    <p className="text-sm font-bold">₹{product.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="nearest">
                <p className="text-muted-foreground">Nearest supplies content coming soon...</p>
              </TabsContent>

              <TabsContent value="verified">
                <p className="text-muted-foreground">Verified suppliers content coming soon...</p>
              </TabsContent>
            </Tabs>

            {/* Related Searches */}

            {/* BOM Banner */}
            <section className="mt-16 bg-muted rounded-lg p-8 text-center">
              <p className="text-lg mb-4">
                Still searching for the perfect supplier? Let verified partners come to you. Request Your BOM Today!
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                BOM
              </Button>
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 ARQONZ.COM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
