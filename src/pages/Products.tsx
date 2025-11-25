import { Header } from "@/components/Header";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import productsHero from "@/assets/products-hero.mp4";
import { ShoppingCart, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import "@/styles/products.css";
import Cementcaculator from "@/assets/calculators/cement-calculator.png";
import Brick from "@/assets/calculators/air-changes-per-hour-calculator.png"
import { CategoryCard } from "@/components/products/categoryCard";
import { HorizontalScroll } from "@/components/products/HorizontalScroll";
import { ProductCatalogBanner } from "@/components/ProductLandingBanner";


export default function Products() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = (categoryId: string, subCategoryId?: string) => {
    if (subCategoryId) {
      console.log('Navigate to subcategory:', subCategoryId);
    } else {
      console.log('Navigate to category:', categoryId);
    }
  };

  const categoriesData = {
    civil: {
      id: "/civil",
      name: "Kitchen & Wardrobe",
      image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
      subCategory: [
        {
          name: "Glass Wardrobe",
          id: "/civil/sand",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
        },
        {
          name: "Cupboard",
          id: "/civil/gravel",
          image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80"
        },
        {
          name: "Modern kitchen",
          id: "/civil/cement",
          image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80"
        }
      ]
    },
    electrical: {
      id: "/electrical",
      name: "Electrical & Lighting",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
      subCategory: [
        {
          name: "LED Lights",
          id: "/electrical/led",
          image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&q=80"
        },
        {
          name: "Switches",
          id: "/electrical/switches",
          image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80"
        },
        {
          name: "Wiring",
          id: "/electrical/wiring",
          image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80"
        }
      ]
    },
    plumbing: {
      id: "/plumbing",
      name: "Plumbing & Bathroom",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      subCategory: [
        {
          name: "Faucets",
          id: "/plumbing/faucets",
          image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80"
        },
        {
          name: "Shower",
          id: "/plumbing/shower",
          image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&q=80"
        },
        {
          name: "Pipes",
          id: "/plumbing/pipes",
          image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80"
        }
      ]
    },
    dasfjhdfs: {
      id: "/civil",
      name: "Kitchen & Wardrobe",
      image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
      subCategory: [
        {
          name: "Glass Wardrobe  & kitchen",
          id: "/civil/sand",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
        },
        {
          name: "Cupboard",
          id: "/civil/gravel",
          image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80"
        },
        {
          name: "Modern kitchen",
          id: "/civil/cement",
          image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80"
        }
      ]
    },
    djsjsdla: {
      id: "/electrical",
      name: "Electrical & Lighting",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
      subCategory: [
        {
          name: "LED Lights",
          id: "/electrical/led",
          image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&q=80"
        },
        {
          name: "Switches",
          id: "/electrical/switches",
          image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80"
        },
        {
          name: "Wiring",
          id: "/electrical/wiring",
          image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80"
        }
      ]
    },
    dsjksajdlk: {
      id: "/plumbing",
      name: "Plumbing & Bathroom",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      subCategory: [
        {
          name: "Faucets",
          id: "/plumbing/faucets",
          image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80"
        },
        {
          name: "Shower",
          id: "/plumbing/shower",
          image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&q=80"
        },
        {
          name: "Pipes",
          id: "/plumbing/pipes",
          image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80"
        }
      ]
    }
  };
  
  const products = [
    {
      "productId": "P1001",
      "productName": "Cement",
      "productImage": Cementcaculator,
      "originalPrice": 4999,
      "offerPrice": 3499,
      "offerPercentage": 30,
      "moq": "5 units",
      "rating": 4,
      "onNavigate": "function(productId) { console.log('Navigate to', productId); }",
      "onWishlistToggle": "function(productId, isWishlisted) { console.log('Wishlist toggled:', productId, isWishlisted); }"
    },
    {
      "productId": "P1002",
      "productName": "Content is wider than the container Content is wider than the container",
      "productImage": Brick,
      "originalPrice": 4999,
      "offerPrice": 3499,
      "offerPercentage": 30,
      "moq": "5 units",
      "rating": 4,
      "onNavigate": "function(productId) { console.log('Navigate to', productId); }",
      "onWishlistToggle": "function(productId, isWishlisted) { console.log('Wishlist toggled:', productId, isWishlisted); }"
    },
    {
      "productId": "P1003",
      "productName": "Cement",
      "productImage": Cementcaculator,
      "originalPrice": 4999,
      "offerPrice": 3499,
      "offerPercentage": 30,
      "moq": "5 units",
      "rating": 4.5,
      "onNavigate": "function(productId) { console.log('Navigate to', productId); }",
      "onWishlistToggle": "function(productId, isWishlisted) { console.log('Wishlist toggled:', productId, isWishlisted); }"
    },
    {
      "productId": "P1004",
      "productName": "Cement",
      "productImage": Brick,
      "originalPrice": 4999,
      "offerPrice": 3499,
      "offerPercentage": 30,
      "moq": "5 units",
      "rating": 4,
      "onNavigate": "function(productId) { console.log('Navigate to', productId); }",
      "onWishlistToggle": "function(productId, isWishlisted) { console.log('Wishlist toggled:', productId, isWishlisted); }"
    },
    {
      "productId": "P1005",
      "productName": "Cement",
      "productImage": Cementcaculator,
      "originalPrice": 4999,
      "offerPrice": 3499,
      "offerPercentage": 30,
      "moq": "5 units",
      "rating": 4,
      "onNavigate": "function(productId) { console.log('Navigate to', productId); }",
      "onWishlistToggle": "function(productId, isWishlisted) { console.log('Wishlist toggled:', productId, isWishlisted); }"
    }
  ];

  const handleNavigate = (productId) => {
    console.log('Navigate to product:', productId);
  };

  const handleWishlistToggle = (productId, isAdded) => {
    console.log(`Product ${productId} ${isAdded ? 'added to' : 'removed from'} wishlist`);
  };

  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="md:text-5xl text-3xl font-bold mb-4">
              <span className="gradient-style">AI-powered</span> instant quotes for construction products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get accurate and cost-effective solutions, supplier access, system support and materials with quality for construction industry
            </p>
          </div>
          <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
            <video 
              src={productsHero} 
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-3">
            Explore our wide range of
          </h2>
          <h3 className="text-5xl font-bold text-center gradient-style mb-12">Products</h3>
          
          <HorizontalScroll id="categories-scroll">
            {Object.entries(categoriesData).map(([key, category]) => (
              <CategoryCard
                catergoryId={category.id}
                categoryName={category.name}
                categoryImage={category.image}
                subcategories={category.subCategory}
                onNavigate={(subId) => handleCardClick(category.id, subId)}
              />
            ))}
          </HorizontalScroll>
        </div>
      </section>

      {/* Recommended Deals Section */}
      <ProductCatalogBanner/>

      {/* Top Deals Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold text-center ">
              Top <span className="gradient-style">Deals</span>
            </h2>
            <Button 
              variant="link" 
              className="text-primary text-xl md:text-2xl font-semibold" 
              onClick={() => navigate('/products/listing')}
            >
              See all
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <HorizontalScroll id="deals-scroll">
              {featuredProducts.map((product) => (
                <div key={product.productId} className="flex-none">
                  <ProductCard 
                    productId={product.productId} 
                    productName={product.productName}
                    originalPrice={product.originalPrice}
                    offerPrice={product.offerPrice}
                    offerPercentage={product.offerPercentage}
                    rating={product.rating}
                    productImage={product.productImage} 
                    moq={typeof product.moq === "string" ? (parseInt(product.moq) || 0) : (product.moq as number)}
                    onNavigate={() => handleNavigate(product.productId)}
                    onWishlistToggle={(isAdded) => handleWishlistToggle(product.productId, isAdded)}
                  />
                </div>
              ))}
            </HorizontalScroll>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No products available yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold">
              New Arrivals from <span className="text-primary">Suppliers</span>
            </h2>
            <Button variant="link" className="text-primary text-xl md:text-2xl font-semibold" onClick={() => navigate('/products/listing')}>See all</Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : newArrivals.length > 0 ? (
            <HorizontalScroll id="new-arrivals-scroll">
              {newArrivals.map((product) => (
                <div key={product.productId} className="flex-none">
                  <ProductCard 
                    productId={product.productId} 
                    productName={product.productName}
                    originalPrice={product.originalPrice}
                    offerPrice={product.offerPrice}
                    offerPercentage={product.offerPercentage}
                    rating={5}
                    productImage={product.productImage || `https://images.unsplash.com/photo-1556228720?w=400`} 
                    moq={typeof product.moq === "string" ? (parseInt(product.moq) || 0) : (product.moq as number)}
                    onNavigate={() => handleNavigate(product.productId)}
                    onWishlistToggle={(isAdded) => handleWishlistToggle(product.productId, isAdded)}
                  />
                </div>
              ))}
            </HorizontalScroll>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No new arrivals yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 ARQONZ.COM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 