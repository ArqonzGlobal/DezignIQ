import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Weight, ArrowRightLeft } from "lucide-react";

interface WeightConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WeightUnit = 'kg' | 'ton' | 'lb' | 'quintal';

const weightUnits = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'ton', label: 'Metric Tons (t)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'quintal', label: 'Quintals (q)' },
];

export const WeightConverterModal = ({ isOpen, onClose }: WeightConverterModalProps) => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<WeightUnit>('kg');
  const [toUnit, setToUnit] = useState<WeightUnit>('lb');

  const convertToKg = (value: number, unit: WeightUnit): number => {
    const conversions = {
      kg: value,
      ton: value * 1000,
      lb: value * 0.453592,
      quintal: value * 100,
    };
    return conversions[unit];
  };

  const convertFromKg = (kg: number, unit: WeightUnit): number => {
    const conversions = {
      kg: kg,
      ton: kg / 1000,
      lb: kg / 0.453592,
      quintal: kg / 100,
    };
    return conversions[unit];
  };

  const result = convertFromKg(convertToKg(inputValue, fromUnit), toUnit);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Weight className="w-5 h-5" />
            Weight/Mass Converter
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Converter</TabsTrigger>
            <TabsTrigger value="guide">Guide & Formula</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <Label>From Unit</Label>
                <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as WeightUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weightUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(Number(e.target.value) || 0)}
                  placeholder="Enter value"
                />
              </div>

              <div className="flex items-center justify-center">
                <ArrowRightLeft className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>To Unit</Label>
                <Select value={toUnit} onValueChange={(v) => setToUnit(v as WeightUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weightUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {result.toFixed(6)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {inputValue} {fromUnit} = {result.toFixed(6)} {toUnit}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Formulas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Base Conversions to kg</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>1 kg = 1 kilogram (base unit)</li>
                    <li>1 metric ton = 1,000 kg</li>
                    <li>1 pound (lb) = 0.453592 kg</li>
                    <li>1 quintal = 100 kg</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Common Conversions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>1 kg ≈ 2.20462 lb</li>
                    <li>1 ton = 10 quintals</li>
                    <li>1 quintal ≈ 220.462 lb</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
