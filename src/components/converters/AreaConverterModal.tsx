import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Square, ArrowRightLeft } from "lucide-react";

interface AreaConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AreaUnit = 'sqm' | 'sqft' | 'acre' | 'hectare';

const areaUnits = [
  { value: 'sqm', label: 'Square Meters (m²)' },
  { value: 'sqft', label: 'Square Feet (ft²)' },
  { value: 'acre', label: 'Acres' },
  { value: 'hectare', label: 'Hectares (ha)' },
];

export const AreaConverterModal = ({ isOpen, onClose }: AreaConverterModalProps) => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<AreaUnit>('sqm');
  const [toUnit, setToUnit] = useState<AreaUnit>('sqft');

  const convertToSqM = (value: number, unit: AreaUnit): number => {
    const conversions = {
      sqm: value,
      sqft: value * 0.092903,
      acre: value * 4046.86,
      hectare: value * 10000,
    };
    return conversions[unit];
  };

  const convertFromSqM = (sqm: number, unit: AreaUnit): number => {
    const conversions = {
      sqm: sqm,
      sqft: sqm / 0.092903,
      acre: sqm / 4046.86,
      hectare: sqm / 10000,
    };
    return conversions[unit];
  };

  const result = convertFromSqM(convertToSqM(inputValue, fromUnit), toUnit);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Square className="w-5 h-5" />
            Area Converter
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
                <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as AreaUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {areaUnits.map((unit) => (
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
                <Select value={toUnit} onValueChange={(v) => setToUnit(v as AreaUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {areaUnits.map((unit) => (
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
                  <h4 className="font-semibold mb-2">Base Conversions to m²</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>1 m² = 1 square meter (base unit)</li>
                    <li>1 ft² = 0.092903 m²</li>
                    <li>1 acre = 4,046.86 m²</li>
                    <li>1 hectare = 10,000 m²</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Common Conversions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>1 m² ≈ 10.764 ft²</li>
                    <li>1 acre ≈ 43,560 ft²</li>
                    <li>1 hectare = 2.471 acres</li>
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
