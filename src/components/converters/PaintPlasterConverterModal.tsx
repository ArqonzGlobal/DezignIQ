import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface PaintPlasterConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const coverageRates = [
  { type: "Emulsion Paint", coverage: 12, unit: "m²/L" },
  { type: "Oil Paint", coverage: 14, unit: "m²/L" },
  { type: "Primer", coverage: 10, unit: "m²/L" },
  { type: "Exterior Paint", coverage: 10, unit: "m²/L" },
  { type: "Plaster (6mm)", coverage: 1.2, unit: "m²/bag" },
  { type: "Plaster (12mm)", coverage: 0.6, unit: "m²/bag" },
];

export const PaintPlasterConverterModal = ({ isOpen, onClose }: PaintPlasterConverterModalProps) => {
  const [materialType, setMaterialType] = useState(coverageRates[0].type);
  const [area, setArea] = useState("");
  const [coats, setCoats] = useState("2");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const areaValue = parseFloat(area);
    const coatsValue = parseInt(coats);
    const material = coverageRates.find(m => m.type === materialType);
    
    if (material && areaValue && coatsValue) {
      const totalArea = areaValue * coatsValue;
      const quantityNeeded = totalArea / material.coverage;
      const withWastage = quantityNeeded * 1.1; // 10% wastage
      
      setResult({
        materialType: material.type,
        area: areaValue.toFixed(2),
        coats: coatsValue,
        totalArea: totalArea.toFixed(2),
        coverage: material.coverage,
        unit: material.unit,
        quantityNeeded: quantityNeeded.toFixed(2),
        withWastage: withWastage.toFixed(2),
        wastagePercent: 10
      });
    }
  };

  const handleReset = () => {
    setArea("");
    setCoats("2");
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Paint / Plaster Coverage Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Coverage Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Material Type</Label>
                <Select value={materialType} onValueChange={setMaterialType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {coverageRates.map(m => (
                      <SelectItem key={m.type} value={m.type}>
                        {m.type} ({m.coverage} {m.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Wall Area (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter wall area"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coats">Number of Coats</Label>
                <Input
                  id="coats"
                  type="number"
                  value={coats}
                  onChange={(e) => setCoats(e.target.value)}
                  placeholder="Enter number of coats"
                  min="1"
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
                        <span className="text-muted-foreground">Material:</span>
                        <span className="font-medium">{result.materialType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wall Area:</span>
                        <span className="font-medium">{result.area} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Number of Coats:</span>
                        <span className="font-medium">{result.coats}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Coverage:</span>
                        <span className="font-medium">{result.totalArea} m²</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-muted-foreground font-semibold">Quantity Needed:</span>
                        <span className="font-bold text-primary">{result.quantityNeeded} {result.unit.split('/')[1]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">With {result.wastagePercent}% Wastage:</span>
                        <span className="font-medium text-primary">{result.withWastage} {result.unit.split('/')[1]}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3>Standard Coverage Rates</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr>
                      <th className="border p-2">Material</th>
                      <th className="border p-2">Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coverageRates.map(m => (
                      <tr key={m.type}>
                        <td className="border p-2">{m.type}</td>
                        <td className="border p-2">{m.coverage} {m.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="mt-4">Application Tips</h3>
              <ul>
                <li><strong>Paint:</strong> Typically requires 2 coats (1 primer + 1 finish, or 2 finish coats)</li>
                <li><strong>Porous surfaces:</strong> May require additional primer coat</li>
                <li><strong>Dark colors:</strong> Often need 3 coats for even coverage</li>
                <li><strong>Plaster:</strong> Single coat application, thickness determines coverage</li>
                <li>Always add 10-15% for wastage and touch-ups</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
