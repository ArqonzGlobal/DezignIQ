import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
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

        const [dd, mm, yyyy, hh, min] = dateTime.split("-").map(Number);

        const loginTime = new Date(yyyy, mm - 1, dd, hh, min);

        const now = new Date();

        const validUntil = new Date(loginTime.getTime() + 5 * 60 * 1000);

        console.log("Login time:", loginTime);
        console.log("Valid until:", validUntil);
        console.log("Now:", now);

        if (now <= validUntil) {
          // VALID LOGIN (within 5 min)
          setIsLoggedIn(true);
          toast({
            title: "Login successful",
            description: "You are now logged in.",
          });
        } else {
          toast({
            title: "Login link expired",
            description: "The login link has expired. Please try signing in again.",
            variant: "destructive",
          });
        }

        window.history.replaceState({}, document.title, window.location.pathname);
      }
      else {
        toast({
          title: "Invalid login code",
          description: "The login code is invalid. Please try signing in again.",
          variant: "destructive",
        });
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
