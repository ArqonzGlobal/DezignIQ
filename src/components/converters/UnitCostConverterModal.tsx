import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface UnitCostConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const costUnits = [
  { unit: "per Square Foot (sqft)", key: "sqft", factor: 1 },
  { unit: "per Square Meter (sqm)", key: "sqm", factor: 10.7639 },
  { unit: "per Square Yard (sqyd)", key: "sqyd", factor: 9 },
  { unit: "per Cent (100 sqft)", key: "cent", factor: 100 },
  { unit: "per Acre", key: "acre", factor: 43560 }
];

export const UnitCostConverterModal = ({ isOpen, onClose }: UnitCostConverterModalProps) => {
  const { currencySymbol } = useCurrency();
  const [fromUnit, setFromUnit] = useState("sqft");
  const [toUnit, setToUnit] = useState("sqm");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    const fromFactor = costUnits.find(u => u.key === fromUnit)?.factor || 1;
    const toFactor = costUnits.find(u => u.key === toUnit)?.factor || 1;

    const resultValue = (value * fromFactor) / toFactor;
    setResult(resultValue.toFixed(2));
  };

  const handleReset = () => {
    setInputValue("");
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unit Cost Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Formula</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Cost Unit</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {costUnits.map(unit => (
                      <SelectItem key={unit.key} value={unit.key}>{unit.unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To Cost Unit</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {costUnits.map(unit => (
                      <SelectItem key={unit.key} value={unit.key}>{unit.unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cost ({currencySymbol})</Label>
              <Input
                type="number"
                placeholder={`Enter cost in ${currencySymbol}`}
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
                <p className="text-lg font-semibold">
                  Result: {currencySymbol} {result} {costUnits.find(u => u.key === toUnit)?.unit}
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Common Cost Unit Conversions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>1 sqm = 10.7639 sqft</li>
                  <li>1 sqyd = 9 sqft</li>
                  <li>1 cent = 100 sqft</li>
                  <li>1 acre = 43,560 sqft</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Real estate pricing and comparison</li>
                  <li>Construction cost estimation and budgeting</li>
                  <li>Material pricing standardization</li>
                  <li>Tender preparation and bid analysis</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Formula</h3>
                <p className="text-sm">Result = (Input Cost × From Factor) ÷ To Factor</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
