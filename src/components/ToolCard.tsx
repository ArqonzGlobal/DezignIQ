  import { Button } from "@/components/ui/button";
  import { Card } from "@/components/ui/card";
  import { ArrowRight, Zap } from "lucide-react";

  interface ToolCardProps {
    title: string;
    description: string;
    image: string;
    credits: number;
    onLaunch: () => void;
    compact?: boolean;
  }

  export const ToolCard = ({ title, description, image, credits, onLaunch, compact = false }: ToolCardProps) => {
    return (
      <Card className="overflow-hidden bg-gradient-card shadow-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
        <div className={compact ? "aspect-[16/7] overflow-hidden" : "aspect-[4/3] overflow-hidden"}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className={compact ? "p-3 space-y-2" : "p-6 space-y-4"}>
          <div>
            <h3 className={compact ? "text-base font-semibold mb-1" : "text-lg font-semibold mb-2"}>{title}</h3>
            <p className={compact ? "text-xs text-muted-foreground leading-snug line-clamp-2" : "text-sm text-muted-foreground leading-relaxed"}>
              {description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              onClick={onLaunch}
              variant="default"
              size={compact ? "sm" : "sm"}
              className={`mr-3 ${compact} ? "gap-1 text-xs bg-primary hover:bg-primary-light transition-colors" : "gap-2 bg-primary hover:bg-primary-light transition-colors`}
            >
              {compact ? "Launch" : "Launch Tool"}
              <ArrowRight className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
            </Button>
            
            {credits > 0 && (
              <div className={compact ? "flex items-center gap-0.5 text-[10px] text-muted-foreground" : "flex items-center gap-1 text-xs text-muted-foreground"}>
                <Zap className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
                {credits} Credits / Generation
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };