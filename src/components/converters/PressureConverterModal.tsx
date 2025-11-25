import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface PressureConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const pressureUnits = [
  { unit: "Pa (Pascal)", key: "pa", factor: 1 },
  { unit: "kPa (Kilopascal)", key: "kpa", factor: 1000 },
  { unit: "bar", key: "bar", factor: 100000 },
  { unit: "psi (lb/in²)", key: "psi", factor: 6894.76 },
  { unit: "kg/cm²", key: "kgcm2", factor: 98066.5 },
  { unit: "atm (atmosphere)", key: "atm", factor: 101325 },
];

export const PressureConverterModal = ({ isOpen, onClose }: PressureConverterModalProps) => {
  const [fromUnit, setFromUnit] = useState("pa");
  const [toUnit, setToUnit] = useState("bar");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string>("");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      const fromFactor = pressureUnits.find(u => u.key === fromUnit)?.factor || 1;
      const toFactor = pressureUnits.find(u => u.key === toUnit)?.factor || 1;
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
          <DialogTitle>Pressure Converter</DialogTitle>
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
                      {pressureUnits.map(u => (
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
                      {pressureUnits.map(u => (
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
                        {result} {pressureUnits.find(u => u.key === toUnit)?.unit.split(' ')[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {inputValue} {pressureUnits.find(u => u.key === fromUnit)?.unit.split(' ')[0]} = {result} {pressureUnits.find(u => u.key === toUnit)?.unit.split(' ')[0]}
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
                <li>1 bar = 100,000 Pa = 100 kPa</li>
                <li>1 psi = 6,894.76 Pa ≈ 0.0689 bar</li>
                <li>1 kg/cm² = 98,066.5 Pa ≈ 0.981 bar</li>
                <li>1 atm = 101,325 Pa ≈ 1.013 bar</li>
              </ul>

              <h3>Applications</h3>
              <ul>
                <li><strong>HVAC:</strong> Typically measured in Pa or inches of water</li>
                <li><strong>Plumbing:</strong> Usually specified in psi or bar</li>
                <li><strong>Structural:</strong> Often uses kg/cm² or MPa</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
