import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface WaterUsageConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const waterUnits = [
  { unit: "Liters", key: "liters", factor: 1 },
  { unit: "Gallons (US)", key: "gallons_us", factor: 0.264172 },
  { unit: "Gallons (UK)", key: "gallons_uk", factor: 0.219969 },
  { unit: "Cubic Meters", key: "cubic_meters", factor: 0.001 },
  { unit: "Cubic Feet", key: "cubic_feet", factor: 0.0353147 }
];

export const WaterUsageConverterModal = ({ isOpen, onClose }: WaterUsageConverterModalProps) => {
  const [fromUnit, setFromUnit] = useState("liters");
  const [toUnit, setToUnit] = useState("gallons_us");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    const fromFactor = waterUnits.find(u => u.key === fromUnit)?.factor || 1;
    const toFactor = waterUnits.find(u => u.key === toUnit)?.factor || 1;

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
          <DialogTitle>Water Usage Converter</DialogTitle>
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
                    {waterUnits.map(unit => (
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
                    {waterUnits.map(unit => (
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
                <p className="text-lg font-semibold">Result: {result} {waterUnits.find(u => u.key === toUnit)?.unit}</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Common Water Conversions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>1 cubic meter = 1,000 liters</li>
                  <li>1 liter = 0.264172 US gallons</li>
                  <li>1 liter = 0.219969 UK gallons</li>
                  <li>1 cubic foot = 28.3168 liters</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Plumbing system design and water supply calculations</li>
                  <li>Rainwater harvesting and storage tank sizing</li>
                  <li>Water conservation and efficiency analysis</li>
                  <li>Irrigation system planning</li>
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
