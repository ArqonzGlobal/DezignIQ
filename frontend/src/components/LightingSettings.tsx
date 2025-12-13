import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sunrise, Moon } from "lucide-react";

interface LightingSettingsProps {
  lightingMode: 'morning' | 'night';
  onLightingModeChange: (mode: 'morning' | 'night') => void;
  additionalPrompt: string;
  onAdditionalPromptChange: (prompt: string) => void;
}

export const LightingSettings = ({ 
  lightingMode, 
  onLightingModeChange, 
  additionalPrompt, 
  onAdditionalPromptChange 
}: LightingSettingsProps) => {
  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-4 block">Lighting Settings</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={lightingMode === 'morning' ? 'default' : 'outline'}
              className="h-auto p-4 flex-col gap-2"
              onClick={() => onLightingModeChange('morning')}
            >
              <Sunrise className="h-6 w-6" />
              <span className="font-medium">Morning Light</span>
              <span className="text-xs opacity-75">Natural daylight</span>
            </Button>
            
            <Button
              variant={lightingMode === 'night' ? 'default' : 'outline'}
              className="h-auto p-4 flex-col gap-2"
              onClick={() => onLightingModeChange('night')}
            >
              <Moon className="h-6 w-6" />
              <span className="font-medium">Night Setting</span>
              <span className="text-xs opacity-75">Evening atmosphere</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="additional-prompt" className="text-base font-semibold">
            Additional Prompts (Optional)
          </Label>
          <Textarea
            id="additional-prompt"
            placeholder="Add specific details like architectural style, materials, landscape features..."
            value={additionalPrompt}
            onChange={(e) => onAdditionalPromptChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            These details will be added to enhance the rendering quality
          </p>
        </div>
      </div>
    </Card>
  );
};