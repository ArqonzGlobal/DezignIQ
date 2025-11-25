import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
  return (
    <div className="flex items-center bg-card rounded-full shadow-sm border max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" className="rounded-full gap-2 px-">
        <span className="text-sm font-medium">Select location</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for products, professionals, properties..."
          className="border-0 bg-transparent pl-10 pr-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
};