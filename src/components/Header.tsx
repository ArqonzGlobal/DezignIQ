import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import logoArq from "@/assets/logo-arq.png";
import { useUser } from "@/contexts/UserContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { NotificationPopup } from "./NotificationPopup";
import { ArrowLeft, Heart, User, Menu, LogIn, LogOut, MapPin, Locate, HelpCircle, Settings, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
  onToolsClick?: () => void;
  onAIToolsClick?: () => void;
  showingCalculators?: boolean;
}

export const Header = ({
  showBackButton = false,
  onBack,
  onToolsClick,
  onAIToolsClick,
  showingCalculators = false,
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState<string>("Detect location");
  const [manualLocation, setManualLocation] = useState<string>("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useUser();
  // Check authentication status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Use reverse geocoding to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();

          const pincode = data.address?.postcode || "Unknown location";

          setLocation(pincode);
          toast.success(`Location detected: ${pincode}`);
        } catch (error) {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          toast.error("Could not fetch location name");
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location access denied. Please enable location permissions.");
        } else {
          toast.error("Unable to detect location");
        }
        console.error("Geolocation error:", error);
      },
    );
  };

  const handleManualLocationSubmit = () => {
    if (manualLocation.trim()) {
      setLocation(manualLocation.trim());
      toast.success(`Location set to: ${manualLocation.trim()}`);
      setLocationOpen(false);
      setManualLocation("");
    }
  };

  function handleSignInRedirect() {
    const redirectUrl = `https://arqonz.com/en/account/login?redirect=https://dezigniq.arqonz.com/`;

    window.location.href = redirectUrl;
  }

    function handleSignOut() {
      setIsLoggedIn(false);

      window.location.href = "/";
    }


  // const handleSignOut = async () => {
  //   try {
  //     const { error } = await supabase.auth.signOut();
  //     if (error) throw error;
  //     toast.success("Signed out successfully");
  //     navigate("/");
  //   } catch (error: any) {
  //     toast.error("Failed to sign out: " + error.message);
  //   }
  // };

  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* {showBackButton && (
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )} */}

            <div className="flex items-center">
              <img src={logoArq} alt="ARQONZ.COM" className="h-8" />
            </div>
          </div>

          {/* <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl">
            <Popover open={locationOpen} onOpenChange={setLocationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 min-w-[150px] justify-start"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="truncate text-sm">{location}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 bg-background border shadow-lg z-[100]"
                align="start"
                sideOffset={8}
                onInteractOutside={(e) => {
                  setLocationOpen(false);
                }}
              >
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <h4 className="font-semibold mb-2">Location Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Your location helps us show relevant products and services
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        detectLocation();
                      }}
                      disabled={isDetecting}
                    >
                      <Locate className={`h-4 w-4 ${isDetecting ? "animate-spin" : ""}`} />
                      {isDetecting ? "Detecting..." : "Auto-detect Location"}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manual-location" className="text-sm">
                      City or Area
                    </Label>
                    <Input
                      id="manual-location"
                      placeholder="Enter your location"
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleManualLocationSubmit();
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleManualLocationSubmit();
                      }}
                      disabled={!manualLocation.trim()}
                    >
                      Set Location
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex-1 max-w-lg">
              <SearchBar />
            </div>
          </div> */}

          <div className="flex items-center gap-2">
            
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/knowledge-base")}
              className="hidden sm:flex"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>

           
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile/chat")}
              className="hidden sm:flex"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>

          
            <NotificationPopup /> */}

            {/* <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <nav className="flex flex-col gap-4 mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      navigate("/home");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Home
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" asChild>
                    <a href="https://www.arqonz.com/products" target="_blank" rel="noopener noreferrer">
                      All Categories
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      navigate("/products");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Products
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      navigate("/professionals");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Professionals
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      navigate("/properties");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Properties
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      navigate("/projects");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Projects
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary font-medium justify-start"
                    onClick={() => {
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Dezign IQ
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary font-medium justify-start"
                    onClick={() => {
                      navigate("/tools");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Tools
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" asChild>
                    <a href="https://www.arqonz.com/deal-desk" target="_blank" rel="noopener noreferrer">
                      Deal Desk
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" asChild>
                    <a href="https://arqonz.com/blog/" target="_blank" rel="noopener noreferrer">
                      Blog
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      navigate("/knowledge-base");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Help & Support
                  </Button>
                </nav>
              </SheetContent>
            </Sheet> */}

              {/* <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Heart className="h-4 w-4" />
              </Button> */}
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
                onClick={handleSignInRedirect}
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

        {/* <nav className="hidden lg:flex items-center gap-6 mt-3 pt-3 border-t">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/products")}>
            Products
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/professionals")}>
            Professionals
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/properties")}>
            Properties
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
            Projects
          </Button>
          <Button variant="ghost" size="sm" className="text-primary font-medium" onClick={() => navigate("/design-iq")}>
            Dezign IQ
          </Button>
          <Button variant="ghost" size="sm" className="text-primary font-medium" onClick={() => navigate("/tools")}>
            Tools
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://www.arqonz.com/deal-desk" target="_blank" rel="noopener noreferrer">
              Deal Desk
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://arqonz.com/blog/" target="_blank" rel="noopener noreferrer">
              Blog
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/knowledge-base")}>
            Help & Support
          </Button>
        </nav>

        <div className="md:hidden mt-3 space-y-2">
          <Popover open={locationOpen} onOpenChange={setLocationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 justify-start"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span className="truncate text-sm">{location}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[calc(100vw-2rem)] bg-background border shadow-lg z-[100]"
              align="start"
              sideOffset={8}
              onInteractOutside={(e) => {
                setLocationOpen(false);
              }}
            >
              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                <div>
                  <h4 className="font-semibold mb-2">Location Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Your location helps us show relevant products and services
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      detectLocation();
                    }}
                    disabled={isDetecting}
                  >
                    <Locate className={`h-4 w-4 ${isDetecting ? "animate-spin" : ""}`} />
                    {isDetecting ? "Detecting..." : "Auto-detect Location"}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-location-mobile" className="text-sm">
                    City or Area
                  </Label>
                  <Input
                    id="manual-location-mobile"
                    placeholder="Enter your location"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleManualLocationSubmit();
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManualLocationSubmit();
                    }}
                    disabled={!manualLocation.trim()}
                  >
                    Set Location
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <SearchBar /> */}
        {/* </div> */}
      </div>
    </header>
  );
};
