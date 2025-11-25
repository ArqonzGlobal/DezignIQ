import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { decrypt } from "@/utils/crypto";
import { useUser } from "@/contexts/UserContext";
import DesignIQ from "./pages/DesignIQ";
// import Index from "./pages/Index";
// import Auth from "./pages/Auth";
// import Tools from "./pages/Tools";
// import Products from "./pages/Products";
// import ProductListing from "./pages/ProductListing";
// import ProductDetail from "./pages/ProductDetail";
// import Professionals from "./pages/Professionals";
// import ProfessionalListing from "./pages/ProfessionalListing";
// import ProfessionalProfile from "./pages/ProfessionalProfile";
// import Projects from "./pages/Projects";
// import ProjectsListing from "./pages/ProjectsListing";
// import ProjectDetail from "./pages/ProjectDetail";
// import Properties from "./pages/Properties";
// import PropertiesListing from "./pages/PropertiesListing";
// import PropertyDetail from "./pages/PropertyDetail";
// import Profile from "./pages/Profile";
// import KnowledgeBase from "./pages/KnowledgeBase";
// import { WhatsAppFloat } from "./components/WhatsAppFloat";
// import { FloatingChat } from "./components/FloatingChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { search } = useLocation();
  const { setIsLoggedIn } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const code = params.get("code");

    if (code) {
      const decrypted = decrypt(code);
      console.log("Decrypted code:", decrypted);

      if (decrypted === "login") {
        setIsLoggedIn(true);
        console.log("User is logged in!");

        // Remove ?code= from URL after processing
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [search]);

  return (
    <>
      <Routes>
        <Route path="/" element={<DesignIQ />} />
        {/* <Route path="/auth" element={<Auth />} />
        <Route path="/Home" element={<Index/>} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/listing" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/professionals/listing" element={<ProfessionalListing />} />
        <Route path="/professionals/:id" element={<ProfessionalProfile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/listing" element={<ProjectsListing />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/listing" element={<PropertiesListing />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* <WhatsAppFloat />
      <FloatingChat /> */}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
