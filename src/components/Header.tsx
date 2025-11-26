import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import logoArq from "@/assets/logo-arq.png";
import { useUser } from "@/contexts/UserContext";
import { LogIn } from "lucide-react";

export const Header = ({ searchQuery, setSearchQuery }) => {

  const { isLoggedIn, setIsLoggedIn } = useUser();

  function handleSignInRedirect() {
    const redirectUrl = import.meta.env.VITE_REDIRECT_URI;

    window.location.href = redirectUrl;
  }

    function handleSignOut() {
      setIsLoggedIn(false);

      window.location.href = "/";
    }

  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <img src={logoArq} alt="ARQONZ.COM" className="h-8" />
            </div>
          </div>
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
          <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
};
