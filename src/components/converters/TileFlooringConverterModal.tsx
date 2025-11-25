import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface TileFlooringConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tileSizes = [
  { name: "300x300mm", width: 300, height: 300, areaM2: 0.09, tilesPerBox: 11 },
  { name: "400x400mm", width: 400, height: 400, areaM2: 0.16, tilesPerBox: 7 },
  { name: "600x600mm", width: 600, height: 600, areaM2: 0.36, tilesPerBox: 4 },
  { name: "800x800mm", width: 800, height: 800, areaM2: 0.64, tilesPerBox: 3 },
  { name: "600x1200mm", width: 600, height: 1200, areaM2: 0.72, tilesPerBox: 2 },
];

export const TileFlooringConverterModal = ({ isOpen, onClose }: TileFlooringConverterModalProps) => {
  const [tileSize, setTileSize] = useState(tileSizes[2].name);
  const [floorArea, setFloorArea] = useState("");
  const [wastagePercent, setWastagePercent] = useState("10");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const area = parseFloat(floorArea);
    const wastage = parseFloat(wastagePercent);
    const tile = tileSizes.find(t => t.name === tileSize);
    
    if (tile && area && wastage >= 0) {
      const adjustedArea = area * (1 + wastage / 100);
      const tilesNeeded = Math.ceil(adjustedArea / tile.areaM2);
      const boxesNeeded = Math.ceil(tilesNeeded / tile.tilesPerBox);
      const totalTiles = boxesNeeded * tile.tilesPerBox;
      const actualCoverage = totalTiles * tile.areaM2;
      
      setResult({
        tileSize: tile.name,
        originalArea: area.toFixed(2),
        adjustedArea: adjustedArea.toFixed(2),
        tilesNeeded: tilesNeeded,
        totalTiles: totalTiles,
        boxesNeeded: boxesNeeded,
        tilesPerBox: tile.tilesPerBox,
        actualCoverage: actualCoverage.toFixed(2),
        extraTiles: totalTiles - tilesNeeded
      });
    }
  };

  const handleReset = () => {
    setFloorArea("");
    setWastagePercent("10");
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tile / Flooring Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Tile Size</Label>
                <Select value={tileSize} onValueChange={setTileSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tileSizes.map(t => (
                      <SelectItem key={t.name} value={t.name}>
                        {t.name} ({t.areaM2} m² per tile)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Floor Area (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={floorArea}
                  onChange={(e) => setFloorArea(e.target.value)}
                  placeholder="Enter floor area"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wastage">Wastage Allowance (%)</Label>
                <Input
                  id="wastage"
                  type="number"
                  value={wastagePercent}
                  onChange={(e) => setWastagePercent(e.target.value)}
                  placeholder="Enter wastage %"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCalculate}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Calculate
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-md border border-input hover:bg-accent"
                >
                  Reset
                </button>
              </div>

              {result && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Results</h3>
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tile Size:</span>
                        <span className="font-medium">{result.tileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Original Area:</span>
                        <span className="font-medium">{result.originalArea} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">With Wastage:</span>
                        <span className="font-medium">{result.adjustedArea} m²</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-muted-foreground font-semibold">Tiles Needed:</span>
                        <span className="font-bold text-primary">{result.tilesNeeded}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-semibold">Boxes to Order:</span>
                        <span className="font-bold text-primary">{result.boxesNeeded}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiles per Box:</span>
                        <span className="font-medium">{result.tilesPerBox}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Tiles:</span>
                        <span className="font-medium">{result.totalTiles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Extra Tiles:</span>
                        <span className="font-medium">{result.extraTiles}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3>Recommended Wastage Allowance</h3>
              <ul>
                <li><strong>Straight lay (5-7%):</strong> Simple grid pattern</li>
                <li><strong>Diagonal lay (10-15%):</strong> 45° angle installation</li>
                <li><strong>Complex patterns (15-20%):</strong> Herringbone, basketweave, etc.</li>
              </ul>

              <h3>Standard Tile Sizes</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr>
                      <th className="border p-2">Size</th>
                      <th className="border p-2">Area/Tile</th>
                      <th className="border p-2">Tiles/Box</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tileSizes.map(t => (
                      <tr key={t.name}>
                        <td className="border p-2">{t.name}</td>
                        <td className="border p-2">{t.areaM2} m²</td>
                        <td className="border p-2">{t.tilesPerBox}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
