import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Settings2 } from "lucide-react";

interface RenderingOptionsProps {
  imageType: string;
  scenario: string;
  geometryInput: number;
  styles: string;
  renderSpeed: string;
  onImageTypeChange: (value: string) => void;
  onScenarioChange: (value: string) => void;
  onGeometryInputChange: (value: number[]) => void;
  onStylesChange: (value: string) => void;
  onRenderSpeedChange: (value: string) => void;
}

export const RenderingOptions = ({
  imageType,
  scenario,
  geometryInput,
  styles,
  renderSpeed,
  onImageTypeChange,
  onScenarioChange,
  onGeometryInputChange,
  onStylesChange,
  onRenderSpeedChange,
}: RenderingOptionsProps) => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings2 className="h-4 w-4" />
          Rendering Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="imageType">Image Type</Label>
            <Select value={imageType} onValueChange={onImageTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select image type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3dmass">3D Mass</SelectItem>
                <SelectItem value="photo">Photo</SelectItem>
                <SelectItem value="drawing">Drawing</SelectItem>
                <SelectItem value="wireframe">Wireframe</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scenario">Design Approach</Label>
            <Select value={scenario} onValueChange={onScenarioChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select approach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="precise">Precise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="geometry">Geometry Preservation</Label>
            <span className="text-sm text-muted-foreground">{geometryInput}%</span>
          </div>
          <Slider
            value={[geometryInput]}
            onValueChange={onGeometryInputChange}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>More Creative</span>
            <span>More Precise</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="styles">Rendering Style</Label>
            <Select value={styles} onValueChange={onStylesChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realistic">Realistic</SelectItem>
                <SelectItem value="night">Night</SelectItem>
                <SelectItem value="sketch">Sketch</SelectItem>
                <SelectItem value="watercolor">Watercolor</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="renderSpeed">Processing Speed</Label>
            <Select value={renderSpeed} onValueChange={onRenderSpeedChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="best">Best Quality</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};