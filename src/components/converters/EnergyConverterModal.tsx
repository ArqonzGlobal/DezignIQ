import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface EnergyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const energyUnits = [
  { unit: "J (Joule)", key: "j", factor: 1 },
  { unit: "kJ (Kilojoule)", key: "kj", factor: 1000 },
  { unit: "kWh (Kilowatt-hour)", key: "kwh", factor: 3600000 },
  { unit: "BTU (British Thermal Unit)", key: "btu", factor: 1055.06 },
  { unit: "cal (calorie)", key: "cal", factor: 4.184 },
  { unit: "kcal (Kilocalorie)", key: "kcal", factor: 4184 },
];

export const EnergyConverterModal = ({ isOpen, onClose }: EnergyConverterModalProps) => {
  const [fromUnit, setFromUnit] = useState("j");
  const [toUnit, setToUnit] = useState("kwh");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string>("");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      const fromFactor = energyUnits.find(u => u.key === fromUnit)?.factor || 1;
      const toFactor = energyUnits.find(u => u.key === toUnit)?.factor || 1;
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
          <DialogTitle>Energy Converter</DialogTitle>
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
                      {energyUnits.map(u => (
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
                      {energyUnits.map(u => (
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
                        {result} {energyUnits.find(u => u.key === toUnit)?.unit.split(' ')[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {inputValue} {energyUnits.find(u => u.key === fromUnit)?.unit.split(' ')[0]} = {result} {energyUnits.find(u => u.key === toUnit)?.unit.split(' ')[0]}
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
                <li>1 kJ = 1000 J</li>
                <li>1 kWh = 3,600,000 J = 3,600 kJ</li>
                <li>1 BTU = 1,055.06 J ≈ 1.055 kJ</li>
                <li>1 kcal = 4,184 J ≈ 4.184 kJ</li>
              </ul>

              <h3>Applications</h3>
              <ul>
                <li><strong>HVAC Design:</strong> Cooling/heating loads in BTU or kWh</li>
                <li><strong>Energy Audit:</strong> Building energy consumption in kWh</li>
                <li><strong>Solar Design:</strong> Energy generation in kWh</li>
                <li><strong>Electrical:</strong> Electricity usage in kWh</li>
              </ul>

              <h3>Common Equivalents</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr>
                      <th className="border p-2">Description</th>
                      <th className="border p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">1 kWh</td>
                      <td className="border p-2">3,412 BTU</td>
                    </tr>
                    <tr>
                      <td className="border p-2">1 ton of cooling</td>
                      <td className="border p-2">12,000 BTU/hr</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Average home (monthly)</td>
                      <td className="border p-2">900 kWh</td>
                    </tr>
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
