import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { decrypt } from "@/utils/crypto";
import { useUser } from "@/contexts/UserContext";
import DesignIQ from "./pages/DesignIQ";
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

      if (decrypted && decrypted.startsWith("loggedin")) {
        const [status, dateTime] = decrypted.split("/");

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
        <Route path="*" element={<NotFound />} />
      </Routes>
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
