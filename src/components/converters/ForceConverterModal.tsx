import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ForceConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const forceUnits = [
  { unit: "N (Newton)", key: "n", factor: 1 },
  { unit: "kN (Kilonewton)", key: "kn", factor: 1000 },
  { unit: "kgf (kilogram-force)", key: "kgf", factor: 9.80665 },
  { unit: "lbf (pound-force)", key: "lbf", factor: 4.44822 },
  { unit: "dyne", key: "dyne", factor: 0.00001 },
];

export const ForceConverterModal = ({ isOpen, onClose }: ForceConverterModalProps) => {
  const [fromUnit, setFromUnit] = useState("n");
  const [toUnit, setToUnit] = useState("kn");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string>("");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      const fromFactor = forceUnits.find(u => u.key === fromUnit)?.factor || 1;
      const toFactor = forceUnits.find(u => u.key === toUnit)?.factor || 1;
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
          <DialogTitle>Force Converter</DialogTitle>
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
                      {forceUnits.map(u => (
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
                      {forceUnits.map(u => (
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
                        {result} {forceUnits.find(u => u.key === toUnit)?.unit.split(' ')[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {inputValue} {forceUnits.find(u => u.key === fromUnit)?.unit.split(' ')[0]} = {result} {forceUnits.find(u => u.key === toUnit)?.unit.split(' ')[0]}
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
                <li>1 kN = 1000 N</li>
                <li>1 kgf = 9.80665 N</li>
                <li>1 lbf = 4.44822 N</li>
                <li>1 N = 100,000 dyne</li>
              </ul>

              <h3>Applications</h3>
              <ul>
                <li><strong>Structural Engineering:</strong> Load calculations in kN</li>
                <li><strong>Mechanical Design:</strong> Forces in N or kN</li>
                <li><strong>Foundation Design:</strong> Bearing capacity in kN or kgf</li>
              </ul>

              <h3>Formula</h3>
              <p>Force = Mass × Acceleration (F = m × a)</p>
              <p>1 Newton = 1 kg × 1 m/s²</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
