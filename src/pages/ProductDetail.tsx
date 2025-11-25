import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Share2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("information");

  const infoRef = useRef<HTMLDivElement | null>(null);
  const packingRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const supplierRef = useRef<HTMLDivElement | null>(null);

  // Map tab names to section refs
  const sections = {
    information: infoRef,
    packing: packingRef,
    reviews: reviewsRef,
    supplier: supplierRef,
  };

  // Smooth scroll (with offset for sticky + header)
  const handleTabClick = (value: string) => {
    const element = document.getElementById(value);
    if (element) {
      const headerOffset = 180; // must match same height as above
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
  let scrollTimeout: NodeJS.Timeout;
  const headerOffset = 180; // sticky header height

  const handleScroll = () => {
    // debounce for smoother updates
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const sectionIds = Object.keys(sections);
      let closestSection = sectionIds[0];
      let minDistance = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - headerOffset);

          // Section top above header and closest to it
          if (rect.top - headerOffset <= 0 && distance < minDistance) {
            closestSection = id;
            minDistance = distance;
          }
        }
      });

      // Update only when section actually changes
      setActiveTab((prev) => (prev !== closestSection ? closestSection : prev));
    }, 50); // debounce delay
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
    clearTimeout(scrollTimeout);
  };
}, []);


  const productImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    "https://images.unsplash.com/photo-1590934235308-a5693e4563e0?w=400",
    "https://images.unsplash.com/photo-1571126049861-80f81c5de5de?w=400",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400",
  ];

  const relatedProducts = Array(4).fill(null).map((_, idx) => ({
    id: idx,
    title: "High-Strength Cement Bricks",
    price: "1,456",
    originalPrice: "1,850",
    discount: "20% off",
    image: `https://images.unsplash.com/photo-${1600585154340 + idx}?w=300`,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
         <h1 className="text-xl lg:text-2xl font-bold mx-5 mb-5">
            High-Strength Cement Bricks - Durable, Weather-Resistant
          </h1>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto">
          {/* LEFT COLUMN: thumbnails + main image (this entire column = 50% width) */}
          <div className="flex gap-4 items-start overflow-hidden">
            {/* Thumbnails column (fixed width) */}
            <div className="w-20  flex-shrink-0 flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`rounded-lg overflow-hidden border-2 h-full ${selectedImage === idx ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>

            {/* Main image area (fills remaining space of left column) */}
            <div className="relative flex-1 rounded-lg bg-muted overflow-hidden flex items-center justify-center">
              <img
                src={productImages[selectedImage]}
                alt="Main product"
                className="object-contain max-h-[80vh] w-full"
              />

              {/* action buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-background/80 rounded-full hover:bg-background">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 bg-background/80 rounded-full hover:bg-background">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: product details (this entire column = 50% width) */}
          <div className="overflow-y-auto h-full p-4 space-y-2 rounded-xl bg-gradient-to-r from-[#FFECE3] to-[#E4C7B8]">
            <Badge variant="secondary" className="mb-1">In Stock</Badge>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm text-muted-foreground">(Reviews: 2567)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">₹1,456</span>
              <span className="text-lg text-muted-foreground line-through">₹1,850</span>
              <Badge variant="destructive">20% off</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Min. Order: 10 pcs</p>

            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                    <span className="px-4">{quantity}</span>
                    <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>+</Button>
                  </div>
                  <span className="text-sm text-muted-foreground">1000+ available</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-3/4" size="lg">Send Enquiry</Button>
              <Button variant="outline" className="w-3/4" size="lg">Chat Now</Button>
            </div>
          </div>
        </div>
        {/* Product Details Tabs */}
        <section className="relative overflow-clip">
          {/* Sticky Tabs */}
          <div className="sticky  top-[60px] lg:top-[124px] z-40 border-b rounded-none h-auto bg-white">
          <div className="flex gap-8 px-4 py-3">
              {Object.keys(sections).map((key) => (
              <button
                  key={key}
                  onClick={() => handleTabClick(key)}
                  className={`pb-2 border-b-2 transition-all  text-black ${
                  activeTab === key ? "border-black" : "border-transparent"
                  }`}
              >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
              ))}
          </div>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-20 mt-8">
          <section id="information" className="scroll-mt-[170px]" ref={infoRef}>
              <div className="w-full flex flex-col justify-center px-6 py-3 text-3xl font-bold min-h-16 my-3 bg-[#FFECE3]">Product Information</div>
              <div className="grid md:grid-cols-2 gap-8 px-3">
                    <div>
                      <h3 className="font-bold text-lg mb-4">Technical Details</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Brand", value: "Kamli" },
                          { label: "Material", value: "Concrete" },
                          { label: "Construction Material", value: "Cement" },
                          { label: "Special Features", value: "Durable" },
                          { label: "Color", value: "Gray" },
                          { label: "Item Package Quantity", value: "1" },
                          { label: "Package Information", value: "Box" },
                          { label: "Net Quantity", value: "600.0 Gram" },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4">Additional Information</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Supplier", value: "Paras Wall Crete Products Pvt. Ltd." },
                          { label: "Address", value: "Unit No 301, Lodha Supremus" },
                          { label: "Item Weight", value: "3kg" },
                          { label: "Country of Origin", value: "India" },
                          { label: "Manufacturer", value: "Kamli" },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
          </section>

          <section id="packing" className="scroll-mt-[150px]" ref={packingRef}>
            <div className="w-full flex flex-col justify-center px-6 py-3 text-3xl font-bold min-h-16 my-3 bg-[#FFECE3]">Packing & Delivery</div>
            <div className="space-y-4 mx-6">
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Standard Unit Does India</li>
                  <li>Material Durable, Commonly exempt from import duty countries</li>
                  <li>Use Damage Typically ranges from 10 to 30 days</li>
                  <li>Key Preposition: Strong, durable, lngether or moulded in steps</li>
                  </ul>
              </div>
          </section>

          <section id="reviews" className="scroll-mt-[150px]" ref={reviewsRef}>
            <div className="w-full flex flex-col justify-center px-6 py-3 text-3xl font-bold min-h-16 my-3 bg-[#FFECE3]">Reviews</div>
            <div className="space-y-6 mx-6">
                  <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      ))}
                  </div>
                  <span className="text-2xl font-bold">4.5</span>
                  <span className="text-muted-foreground">(Reviews: 2567)</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((review) => (
                      <Card key={review}>
                      <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-muted" />
                          <div>
                              <p className="font-medium">Samantha Payne</p>
                              <p className="text-sm text-muted-foreground">Civil Engineer</p>
                          </div>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          </div>
                          <Badge variant="secondary" className="mb-2">
                          <Check className="h-3 w-3 mr-1" />
                          Verified Purchase
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                          Excellent quality bricks! perfect for my construction project. Highly recommend for construction projects.
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">22 Mar 2024</p>
                      </CardContent>
                      </Card>
                  ))}
                  </div>

                  <div className="text-center">
                  <Button variant="outline">View All Reviews</Button>
                  </div>
              </div>
          </section>

          <section id="supplier" className="scroll-mt-[150px]" ref={supplierRef}>
              <div className="w-full flex flex-col justify-center px-6 py-3 text-3xl font-bold min-h-16 my-3 bg-[#FFECE3]">Know your Supplier</div>
              <div className="flex items-start gap-4 m-6">
                  <div className="w-20 h-20 rounded bg-muted" />
                  <div className="flex-1">
                  <h4 className="font-bold mb-1">Paras Wall Crete Products Pvt. Ltd.</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                      Gat No 298/1, At Post Vadgaon Sahani, Pune, Maharashtra, India, 412216
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                      <p className="text-2xl font-bold">15+</p>
                      <p className="text-sm text-muted-foreground">Orders</p>
                      </div>
                      <div>
                      <p className="text-2xl font-bold">98%</p>
                      <p className="text-sm text-muted-foreground">Response Time</p>
                      </div>
                      <div>
                      <p className="text-2xl font-bold">4.8★</p>
                      <p className="text-sm text-muted-foreground">Products</p>
                      </div>
                  </div>
                  </div>
              </div>
              <div className="flex gap-3 my-3">
                  <Button className="flex-1">Chat with Supplier</Button>
                  <Button variant="outline" className="flex-1">Contact Details</Button>
                  <Button variant="outline" className="flex-1">More Products</Button>
              </div>
          </section>
          </div>
       </section>

        {/* Supplier's Popular Products */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Supplier's Popular Products</h2>
            <Button variant="link">View All</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square bg-muted">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm mb-2 line-clamp-2">{product.title}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">₹{product.price}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
                  </div>
                  <span className="text-xs text-destructive">{product.discount}</span>
                  <Button size="sm" className="w-full mt-2">Send Enquiry</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Other Products Recommendations */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Other Products Recommendations</h2>
            <Button variant="link">View All</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square bg-muted">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm mb-2 line-clamp-2">{product.title}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">₹{product.price}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
                  </div>
                  <span className="text-xs text-destructive">{product.discount}</span>
                  <Button size="sm" className="w-full mt-2">Send Enquiry</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 ARQONZ.COM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
