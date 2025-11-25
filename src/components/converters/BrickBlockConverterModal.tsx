import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box } from "lucide-react";

interface BrickBlockConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BrickSize = 'standard' | 'modular' | 'king' | 'queen';

const brickSizes = {
  standard: { length: 230, width: 110, height: 76, name: 'Standard (230×110×76 mm)' },
  modular: { length: 190, width: 90, height: 90, name: 'Modular (190×90×90 mm)' },
  king: { length: 250, width: 120, height: 75, name: 'King (250×120×75 mm)' },
  queen: { length: 240, width: 115, height: 72, name: 'Queen (240×115×72 mm)' },
};

export const BrickBlockConverterModal = ({ isOpen, onClose }: BrickBlockConverterModalProps) => {
  const [brickSize, setBrickSize] = useState<BrickSize>('standard');
  const [wallLength, setWallLength] = useState<number>(10); // meters
  const [wallHeight, setWallHeight] = useState<number>(3); // meters
  const [wallThickness, setWallThickness] = useState<number>(0.23); // meters (single brick)
  const [mortarThickness, setMortarThickness] = useState<number>(10); // mm

  const calculate = () => {
    const brick = brickSizes[brickSize];
    
    // Convert brick dimensions to meters
    const brickLength = (brick.length + mortarThickness) / 1000;
    const brickHeight = (brick.height + mortarThickness) / 1000;
    const brickWidth = (brick.width + mortarThickness) / 1000;

    // Calculate wall area
    const wallArea = wallLength * wallHeight;

    // Calculate wall volume
    const wallVolume = wallLength * wallHeight * wallThickness;

    // Calculate brick volume
    const brickVolume = (brick.length * brick.width * brick.height) / 1000000000; // in m³

    // Calculate number of bricks
    // Bricks per sqm = 1 / (brick length with mortar × brick height with mortar)
    const bricksPerSqm = 1 / (brickLength * brickHeight);
    const totalBricks = Math.ceil(wallArea * bricksPerSqm);

    // Calculate mortar volume (approximately 30% of wall volume)
    const mortarVolume = wallVolume * 0.3;

    return {
      wallArea,
      wallVolume,
      totalBricks,
      bricksPerSqm: bricksPerSqm,
      mortarVolume,
      brickVolume: brickVolume * totalBricks,
    };
  };

  const result = calculate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Box className="w-5 h-5" />
            Brick/Block Converter
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Converter</TabsTrigger>
            <TabsTrigger value="guide">Guide & Formula</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Brick Size</Label>
                  <Select value={brickSize} onValueChange={(v) => setBrickSize(v as BrickSize)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(brickSizes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Wall Length (m)</Label>
                  <Input
                    type="number"
                    value={wallLength}
                    onChange={(e) => setWallLength(Number(e.target.value) || 0)}
                    placeholder="Enter length"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Wall Height (m)</Label>
                  <Input
                    type="number"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(Number(e.target.value) || 0)}
                    placeholder="Enter height"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Wall Thickness (m)</Label>
                  <Select value={wallThickness.toString()} onValueChange={(v) => setWallThickness(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.115">Half Brick (115mm)</SelectItem>
                      <SelectItem value="0.23">Single Brick (230mm)</SelectItem>
                      <SelectItem value="0.345">1.5 Brick (345mm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mortar Thickness (mm)</Label>
                  <Input
                    type="number"
                    value={mortarThickness}
                    onChange={(e) => setMortarThickness(Number(e.target.value) || 0)}
                    placeholder="Typically 10mm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Total Bricks:</span>
                      <span className="text-2xl font-bold text-primary">{result.totalBricks}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Bricks per m²:</span>
                      <span className="text-lg font-semibold">{result.bricksPerSqm.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Wall Area:</span>
                      <span className="text-lg font-semibold">{result.wallArea.toFixed(2)} m²</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Wall Volume:</span>
                      <span className="text-lg font-semibold">{result.wallVolume.toFixed(3)} m³</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Mortar Volume:</span>
                      <span className="text-lg font-semibold">{result.mortarVolume.toFixed(3)} m³</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="pt-4 text-xs text-muted-foreground">
                    <p>Add 5-10% extra for breakage and wastage</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Brick Calculation Formulas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Calculation Method</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Wall Area = Length × Height</li>
                    <li>Bricks per m² = 1 ÷ [(Brick Length + Mortar) × (Brick Height + Mortar)]</li>
                    <li>Total Bricks = Wall Area × Bricks per m²</li>
                    <li>Mortar Volume ≈ 30% of Wall Volume</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Standard Brick Sizes</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Standard:</strong> 230×110×76 mm (~57 bricks/m²)</p>
                    <p><strong>Modular:</strong> 190×90×90 mm (~55 bricks/m²)</p>
                    <p><strong>King:</strong> 250×120×75 mm (~50 bricks/m²)</p>
                    <p><strong>Queen:</strong> 240×115×72 mm (~52 bricks/m²)</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Important Notes</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Always add 5-10% for breakage</li>
                    <li>Mortar thickness typically 10mm</li>
                    <li>Consider openings (doors, windows)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
