import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface PowerConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const powerUnits = [
  { unit: "W (Watt)", key: "w", factor: 1 },
  { unit: "kW (Kilowatt)", key: "kw", factor: 1000 },
  { unit: "HP (Horsepower)", key: "hp", factor: 745.7 },
  { unit: "BTU/hr", key: "btuh", factor: 0.293071 },
  { unit: "ton (of refrigeration)", key: "ton", factor: 3516.85 },
];

export const PowerConverterModal = ({ isOpen, onClose }: PowerConverterModalProps) => {
  const [fromUnit, setFromUnit] = useState("w");
  const [toUnit, setToUnit] = useState("kw");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string>("");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      const fromFactor = powerUnits.find(u => u.key === fromUnit)?.factor || 1;
      const toFactor = powerUnits.find(u => u.key === toUnit)?.factor || 1;
      const resultValue = (value * fromFactor) / toFactor;
      setResult(resultValue.toFixed(6));
    }
  };

  const handleReset = () => {
    setInputValue("");
    setResult("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Power Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Formula</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Unit</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {powerUnits.map(u => (
                        <SelectItem key={u.key} value={u.key}>{u.unit}</SelectItem>
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
                      {powerUnits.map(u => (
                        <SelectItem key={u.key} value={u.key}>{u.unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value to convert"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleConvert}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Convert
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
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {result} {powerUnits.find(u => u.key === toUnit)?.unit.split(' ')[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {inputValue} {powerUnits.find(u => u.key === fromUnit)?.unit.split(' ')[0]} = {result} {powerUnits.find(u => u.key === toUnit)?.unit.split(' ')[0]}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3>Common Conversion Factors</h3>
              <ul>
                <li>1 kW = 1000 W</li>
                <li>1 HP = 745.7 W ≈ 0.746 kW</li>
                <li>1 ton (refrigeration) = 3,516.85 W ≈ 3.517 kW</li>
                <li>1 kW = 3,412 BTU/hr</li>
              </ul>

              <h3>Applications</h3>
              <ul>
                <li><strong>HVAC:</strong> Cooling capacity in tons or kW</li>
                <li><strong>Motors:</strong> Power rating in HP or kW</li>
                <li><strong>Electrical:</strong> Power consumption in W or kW</li>
                <li><strong>Solar Panels:</strong> Generation capacity in kW</li>
              </ul>

              <h3>Common Equipment Ratings</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr>
                      <th className="border p-2">Equipment</th>
                      <th className="border p-2">Typical Power</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">LED Bulb</td>
                      <td className="border p-2">10-20 W</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Ceiling Fan</td>
                      <td className="border p-2">50-75 W</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Window AC (1 ton)</td>
                      <td className="border p-2">1.5 kW</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Split AC (1.5 ton)</td>
                      <td className="border p-2">2 kW</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Small Motor</td>
                      <td className="border p-2">1-5 HP</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Formula</h3>
              <p>Power = Energy / Time</p>
              <p>1 Watt = 1 Joule / second</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
