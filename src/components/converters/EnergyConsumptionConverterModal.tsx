import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface EnergyConsumptionConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const energyUnits = [
  { unit: "Kilowatt-hours (kWh)", key: "kwh", factor: 1 },
  { unit: "Megajoules (MJ)", key: "mj", factor: 3.6 },
  { unit: "British Thermal Units (BTU)", key: "btu", factor: 3412.14 },
  { unit: "Kilocalories (kcal)", key: "kcal", factor: 859.845 }
];

export const EnergyConsumptionConverterModal = ({ isOpen, onClose }: EnergyConsumptionConverterModalProps) => {
  const [fromUnit, setFromUnit] = useState("kwh");
  const [toUnit, setToUnit] = useState("mj");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    const fromFactor = energyUnits.find(u => u.key === fromUnit)?.factor || 1;
    const toFactor = energyUnits.find(u => u.key === toUnit)?.factor || 1;

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
          <DialogTitle>Energy Consumption Converter</DialogTitle>
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
                    {energyUnits.map(unit => (
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
                    {energyUnits.map(unit => (
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
                <p className="text-lg font-semibold">Result: {result} {energyUnits.find(u => u.key === toUnit)?.unit}</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Common Energy Conversions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>1 kWh = 3.6 MJ</li>
                  <li>1 kWh = 3,412.14 BTU</li>
                  <li>1 kWh = 859.845 kcal</li>
                  <li>1 MJ = 0.2778 kWh</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Building energy performance analysis</li>
                  <li>HVAC system efficiency calculations</li>
                  <li>Renewable energy system design</li>
                  <li>Energy audit and optimization</li>
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
