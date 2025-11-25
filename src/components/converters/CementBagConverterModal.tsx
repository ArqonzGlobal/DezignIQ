import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, ArrowRightLeft } from "lucide-react";

interface CementBagConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConversionType = 'weight-to-bags' | 'volume-to-bags' | 'bags-to-weight';

export const CementBagConverterModal = ({ isOpen, onClose }: CementBagConverterModalProps) => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [conversionType, setConversionType] = useState<ConversionType>('weight-to-bags');
  const [bagSize, setBagSize] = useState<number>(50); // kg per bag

  const cementDensity = 1440; // kg/m³ (loose cement)

  const calculate = () => {
    switch (conversionType) {
      case 'weight-to-bags':
        return {
          bags: inputValue / bagSize,
          volume: inputValue / cementDensity,
          weight: inputValue,
        };
      case 'volume-to-bags':
        const weight = inputValue * cementDensity;
        return {
          bags: weight / bagSize,
          volume: inputValue,
          weight: weight,
        };
      case 'bags-to-weight':
        const totalWeight = inputValue * bagSize;
        return {
          bags: inputValue,
          volume: totalWeight / cementDensity,
          weight: totalWeight,
        };
      default:
        return { bags: 0, volume: 0, weight: 0 };
    }
  };

  const result = calculate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Cement Bag Converter
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Converter</TabsTrigger>
            <TabsTrigger value="guide">Guide & Formula</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Conversion Type</Label>
                  <Select value={conversionType} onValueChange={(v) => setConversionType(v as ConversionType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-to-bags">Weight → Bags</SelectItem>
                      <SelectItem value="volume-to-bags">Volume → Bags</SelectItem>
                      <SelectItem value="bags-to-weight">Bags → Weight & Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Bag Size (kg)</Label>
                  <Select value={bagSize.toString()} onValueChange={(v) => setBagSize(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25 kg</SelectItem>
                      <SelectItem value="40">40 kg</SelectItem>
                      <SelectItem value="50">50 kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    {conversionType === 'weight-to-bags' && 'Weight (kg)'}
                    {conversionType === 'volume-to-bags' && 'Volume (m³)'}
                    {conversionType === 'bags-to-weight' && 'Number of Bags'}
                  </Label>
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value) || 0)}
                    placeholder="Enter value"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Number of Bags:</span>
                      <span className="text-xl font-bold text-primary">{result.bags.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Weight (kg):</span>
                      <span className="text-xl font-bold">{result.weight.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Volume (m³):</span>
                      <span className="text-xl font-bold">{result.volume.toFixed(4)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Note</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    <p>Bag size: {bagSize} kg per bag</p>
                    <p>Cement density: {cementDensity} kg/m³ (loose)</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Formulas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Basic Conversions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Number of Bags = Total Weight ÷ Bag Size</li>
                    <li>Volume (m³) = Weight (kg) ÷ Density (1440 kg/m³)</li>
                    <li>Weight (kg) = Volume (m³) × Density (1440 kg/m³)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Common Bag Sizes</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>25 kg - Small projects, easier handling</li>
                    <li>40 kg - Common in some regions</li>
                    <li>50 kg - Standard size (1.09 cubic feet)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Important Notes</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Loose cement density: ~1440 kg/m³</li>
                    <li>1 bag (50kg) ≈ 0.0347 m³</li>
                    <li>Add 5-10% wastage for practical estimates</li>
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
