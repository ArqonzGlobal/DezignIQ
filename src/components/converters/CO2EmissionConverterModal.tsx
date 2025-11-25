import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface CO2EmissionConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emissionUnits = [
  { unit: "Tons CO₂", key: "tons", factor: 1 },
  { unit: "Kilograms CO₂", key: "kg", factor: 1000 },
  { unit: "Tree Equivalents (1 tree = 21.77 kg/year)", key: "trees", factor: 45.93 }
];

export const CO2EmissionConverterModal = ({ isOpen, onClose }: CO2EmissionConverterModalProps) => {
  const [fromUnit, setFromUnit] = useState("tons");
  const [toUnit, setToUnit] = useState("kg");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    const fromFactor = emissionUnits.find(u => u.key === fromUnit)?.factor || 1;
    const toFactor = emissionUnits.find(u => u.key === toUnit)?.factor || 1;

    const resultValue = (value * fromFactor) / toFactor;
    setResult(resultValue.toFixed(4));
  };

  const handleReset = () => {
    setInputValue("");
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>CO₂ Emission Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Formula</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Unit</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emissionUnits.map(unit => (
                      <SelectItem key={unit.key} value={unit.key}>{unit.unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To Unit</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emissionUnits.map(unit => (
                      <SelectItem key={unit.key} value={unit.key}>{unit.unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                type="number"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleConvert} className="flex-1">Convert</Button>
              <Button onClick={handleReset} variant="outline">Reset</Button>
            </div>

            {result && (
              <Card className="p-4 bg-muted">
                <p className="text-lg font-semibold">Result: {result} {emissionUnits.find(u => u.key === toUnit)?.unit}</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Common CO₂ Conversions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>1 ton CO₂ = 1,000 kg CO₂</li>
                  <li>1 tree offsets approximately 21.77 kg CO₂ per year</li>
                  <li>1 ton CO₂ ≈ 45.93 tree-years of carbon sequestration</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Carbon footprint calculation for construction projects</li>
                  <li>Environmental impact assessment</li>
                  <li>Green building certification (LEED, BREEAM)</li>
                  <li>Carbon offset planning and tree planting initiatives</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Formula</h3>
                <p className="text-sm">Result = (Input Value × From Factor) ÷ To Factor</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
