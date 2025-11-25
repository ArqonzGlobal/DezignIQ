import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2 } from "lucide-react";

interface SketchRenderingOptionsProps {
  style: string;
  detailLevel: string;
  colorMode: string;
  lighting: string;
  onStyleChange: (value: string) => void;
  onDetailLevelChange: (value: string) => void;
  onColorModeChange: (value: string) => void;
  onLightingChange: (value: string) => void;
}

export const SketchRenderingOptions = ({
  style,
  detailLevel,
  colorMode,
  lighting,
  onStyleChange,
  onDetailLevelChange,
  onColorModeChange,
  onLightingChange,
}: SketchRenderingOptionsProps) => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings2 className="h-4 w-4" />
          Sketch Rendering Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="style">Rendering Style</Label>
            <Select value={style} onValueChange={onStyleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photorealistic">Photorealistic</SelectItem>
                <SelectItem value="artistic">Artistic</SelectItem>
                <SelectItem value="architectural">Architectural</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailLevel">Detail Level</Label>
            <Select value={detailLevel} onValueChange={onDetailLevelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select detail level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="colorMode">Color Mode</Label>
            <Select value={colorMode} onValueChange={onColorModeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select color mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_color">Full Color</SelectItem>
                <SelectItem value="monochrome">Monochrome</SelectItem>
                <SelectItem value="sepia">Sepia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lighting">Lighting</Label>
            <Select value={lighting} onValueChange={onLightingChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select lighting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="natural">Natural</SelectItem>
                <SelectItem value="dramatic">Dramatic</SelectItem>
                <SelectItem value="soft">Soft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};