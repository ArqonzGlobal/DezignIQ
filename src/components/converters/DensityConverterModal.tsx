import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, ArrowRightLeft } from "lucide-react";

interface DensityConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DensityUnit = 'kg_m3' | 'lb_ft3';

const densityUnits = [
  { value: 'kg_m3', label: 'Kilograms per Cubic Meter (kg/m³)' },
  { value: 'lb_ft3', label: 'Pounds per Cubic Foot (lb/ft³)' },
];

export const DensityConverterModal = ({ isOpen, onClose }: DensityConverterModalProps) => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<DensityUnit>('kg_m3');
  const [toUnit, setToUnit] = useState<DensityUnit>('lb_ft3');

  const convertToKgM3 = (value: number, unit: DensityUnit): number => {
    const conversions = {
      kg_m3: value,
      lb_ft3: value * 16.0185,
    };
    return conversions[unit];
  };

  const convertFromKgM3 = (kgm3: number, unit: DensityUnit): number => {
    const conversions = {
      kg_m3: kgm3,
      lb_ft3: kgm3 / 16.0185,
    };
    return conversions[unit];
  };

  const result = convertFromKgM3(convertToKgM3(inputValue, fromUnit), toUnit);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            Density Converter
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
                <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as DensityUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {densityUnits.map((unit) => (
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
                <Select value={toUnit} onValueChange={(v) => setToUnit(v as DensityUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {densityUnits.map((unit) => (
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
                    {inputValue} {fromUnit === 'kg_m3' ? 'kg/m³' : 'lb/ft³'} = {result.toFixed(6)} {toUnit === 'kg_m3' ? 'kg/m³' : 'lb/ft³'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Common Material Densities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Construction Materials</h4>
                    <ul className="space-y-1">
                      <li>Concrete: ~2,400 kg/m³ (150 lb/ft³)</li>
                      <li>Steel: ~7,850 kg/m³ (490 lb/ft³)</li>
                      <li>Brick: ~1,920 kg/m³ (120 lb/ft³)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Common Materials</h4>
                    <ul className="space-y-1">
                      <li>Water: 1,000 kg/m³ (62.4 lb/ft³)</li>
                      <li>Wood (pine): ~500 kg/m³ (31 lb/ft³)</li>
                      <li>Aluminum: ~2,700 kg/m³ (169 lb/ft³)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Formula</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Density Conversion</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>1 kg/m³ = 0.062428 lb/ft³</li>
                    <li>1 lb/ft³ = 16.0185 kg/m³</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What is Density?</h4>
                  <p className="text-sm text-muted-foreground">
                    Density is the measure of mass per unit volume. It's commonly used in construction to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                    <li>Calculate material weights for structural design</li>
                    <li>Estimate shipping costs</li>
                    <li>Determine load-bearing requirements</li>
                    <li>Compare material properties</li>
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
