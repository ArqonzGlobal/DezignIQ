import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box, ArrowRightLeft } from "lucide-react";

interface VolumeConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VolumeUnit = 'cum' | 'cft' | 'liter' | 'gallon';

const volumeUnits = [
  { value: 'cum', label: 'Cubic Meters (m³)' },
  { value: 'cft', label: 'Cubic Feet (ft³)' },
  { value: 'liter', label: 'Liters (L)' },
  { value: 'gallon', label: 'Gallons (US)' },
];

export const VolumeConverterModal = ({ isOpen, onClose }: VolumeConverterModalProps) => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<VolumeUnit>('cum');
  const [toUnit, setToUnit] = useState<VolumeUnit>('cft');

  const convertToCuM = (value: number, unit: VolumeUnit): number => {
    const conversions = {
      cum: value,
      cft: value * 0.0283168,
      liter: value * 0.001,
      gallon: value * 0.00378541,
    };
    return conversions[unit];
  };

  const convertFromCuM = (cum: number, unit: VolumeUnit): number => {
    const conversions = {
      cum: cum,
      cft: cum / 0.0283168,
      liter: cum / 0.001,
      gallon: cum / 0.00378541,
    };
    return conversions[unit];
  };

  const result = convertFromCuM(convertToCuM(inputValue, fromUnit), toUnit);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Box className="w-5 h-5" />
            Volume Converter
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
                <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as VolumeUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {volumeUnits.map((unit) => (
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
                <Select value={toUnit} onValueChange={(v) => setToUnit(v as VolumeUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {volumeUnits.map((unit) => (
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
                  <h4 className="font-semibold mb-2">Base Conversions to m³</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>1 m³ = 1 cubic meter (base unit)</li>
                    <li>1 ft³ = 0.0283168 m³</li>
                    <li>1 liter = 0.001 m³</li>
                    <li>1 gallon (US) = 0.00378541 m³</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Common Conversions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>1 m³ ≈ 35.315 ft³</li>
                    <li>1 m³ = 1,000 liters</li>
                    <li>1 m³ ≈ 264.172 gallons (US)</li>
                    <li>1 ft³ ≈ 28.317 liters</li>
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
