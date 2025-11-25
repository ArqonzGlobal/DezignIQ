import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler, ArrowRightLeft } from "lucide-react";

interface LengthConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'yd';

const lengthUnits = [
  { value: 'mm', label: 'Millimeters (mm)' },
  { value: 'cm', label: 'Centimeters (cm)' },
  { value: 'm', label: 'Meters (m)' },
  { value: 'in', label: 'Inches (in)' },
  { value: 'ft', label: 'Feet (ft)' },
  { value: 'yd', label: 'Yards (yd)' },
];

export const LengthConverterModal = ({ isOpen, onClose }: LengthConverterModalProps) => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<LengthUnit>('m');
  const [toUnit, setToUnit] = useState<LengthUnit>('ft');

  const convertToMM = (value: number, unit: LengthUnit): number => {
    const conversions = {
      mm: value,
      cm: value * 10,
      m: value * 1000,
      in: value * 25.4,
      ft: value * 304.8,
      yd: value * 914.4,
    };
    return conversions[unit];
  };

  const convertFromMM = (mm: number, unit: LengthUnit): number => {
    const conversions = {
      mm: mm,
      cm: mm / 10,
      m: mm / 1000,
      in: mm / 25.4,
      ft: mm / 304.8,
      yd: mm / 914.4,
    };
    return conversions[unit];
  };

  const result = convertFromMM(convertToMM(inputValue, fromUnit), toUnit);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Length Converter
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
                <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as LengthUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengthUnits.map((unit) => (
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
                <Select value={toUnit} onValueChange={(v) => setToUnit(v as LengthUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengthUnits.map((unit) => (
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
                  <h4 className="font-semibold mb-2">Metric Conversions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>1 meter = 1000 millimeters</li>
                    <li>1 meter = 100 centimeters</li>
                    <li>1 centimeter = 10 millimeters</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Imperial Conversions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>1 inch = 25.4 millimeters</li>
                    <li>1 foot = 12 inches = 304.8 millimeters</li>
                    <li>1 yard = 3 feet = 914.4 millimeters</li>
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
