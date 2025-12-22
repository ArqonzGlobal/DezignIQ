import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Coins } from "lucide-react";
import logoArq from "@/assets/logo-arq.png";
import { useUser } from "@/contexts/UserContext";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/steroid";
import { toast } from "@/hooks/use-toast";

export const Header = ({ searchQuery, setSearchQuery }) => {
  const { isLoggedIn, setIsLoggedIn } = useUser();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    async function fetchCredits() {
      let apiKey = localStorage.getItem("apikey");
      apiKey = apiKey?.replace(/^"|"$/g, "");

      if (!apiKey) return;

      const response = await apiRequest(
        "/get-credits",
        "POST",
        { apiKey }
      );
      if(!response?.success) {
        toast({
          title: "API is Expired!",
          description:"Login again.",
          variant: "default",
        })
        setTimeout(() => {
          handleSignOut();
        }, 3000);
        return;
      }

      if (response?.success) {
        setCredits(response.credits);
      }
    }

    if (isLoggedIn) {
      fetchCredits();
    }
  }, [isLoggedIn]);

  function handleSignIn() {
    navigate("/login");
  }

  function handleSignOut() {
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("apikey");
    window.location.href = "/";
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logoArq} alt="ARQONZ.COM" className="h-8" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="flex items-center bg-card rounded-full shadow-sm border max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search AI Tool..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent pl-10 pr-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* SHOW CREDITS IF LOGGED IN */}
            {isLoggedIn && credits !== null && (
              <div className="flex items-center gap-1 text-sm font-medium">
                <Coins className="h-4 w-4 text-yellow-500" />
                {credits} Credits
              </div>
            )}

            {/* Login / Logout */}
            {isLoggedIn ? (
              <Button
                onClick={handleSignOut}
                variant="default"
                size="sm"
                className="bg-primary hover:bg-primary-light gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign out
              </Button>
            ) : (
              <Button
                onClick={handleSignIn}
                variant="default"
                size="sm"
                className="bg-primary hover:bg-primary-light gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
