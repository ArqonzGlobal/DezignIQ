import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mountain } from "lucide-react";

interface SandAggregateConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MaterialType = 'sand' | 'gravel' | 'stone' | 'crushed-stone';

const materials = {
  sand: { density: 1600, name: 'Sand', truckCapacity: 20 },
  gravel: { density: 1680, name: 'Gravel', truckCapacity: 20 },
  stone: { density: 1700, name: 'Stone Aggregate', truckCapacity: 20 },
  'crushed-stone': { density: 1650, name: 'Crushed Stone', truckCapacity: 20 },
};

export const SandAggregateConverterModal = ({ isOpen, onClose }: SandAggregateConverterModalProps) => {
  const [materialType, setMaterialType] = useState<MaterialType>('sand');
  const [volume, setVolume] = useState<number>(1); // m³
  const [customDensity, setCustomDensity] = useState<number | null>(null);

  const calculate = () => {
    const material = materials[materialType];
    const density = customDensity || material.density;

    const weight = volume * density; // kg
    const weightTons = weight / 1000;
    const truckloads = weight / (material.truckCapacity * 1000);

    return {
      volume,
      weight,
      weightTons,
      truckloads,
      density,
      truckCapacity: material.truckCapacity,
    };
  };

  const result = calculate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mountain className="w-5 h-5" />
            Sand & Aggregate Converter
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
                  <Label>Material Type</Label>
                  <Select value={materialType} onValueChange={(v) => setMaterialType(v as MaterialType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(materials).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Volume (m³)</Label>
                  <Input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value) || 0)}
                    placeholder="Enter volume"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Custom Density (kg/m³) - Optional</Label>
                  <Input
                    type="number"
                    value={customDensity || ''}
                    onChange={(e) => setCustomDensity(e.target.value ? Number(e.target.value) : null)}
                    placeholder={`Default: ${materials[materialType].density} kg/m³`}
                  />
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p className="font-semibold">Current Settings:</p>
                      <p className="text-muted-foreground">
                        Density: {result.density} kg/m³
                      </p>
                      <p className="text-muted-foreground">
                        Truck capacity: {result.truckCapacity} tons
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Volume:</span>
                      <span className="text-xl font-bold text-primary">{result.volume.toFixed(2)} m³</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Weight:</span>
                      <span className="text-xl font-bold">{result.weight.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Weight (Tons):</span>
                      <span className="text-xl font-bold">{result.weightTons.toFixed(3)} tons</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Truckloads:</span>
                      <span className="text-2xl font-bold text-primary">{result.truckloads.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="font-semibold">Quick Conversions:</p>
                      <p>1 m³ ≈ 35.31 ft³</p>
                      <p>1 ton = 1000 kg</p>
                      <p>Truck capacity varies by region</p>
                    </div>
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
                  <h4 className="font-semibold mb-2">Basic Formulas</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Weight (kg) = Volume (m³) × Density (kg/m³)</li>
                    <li>Tons = Weight (kg) ÷ 1000</li>
                    <li>Truckloads = Weight (tons) ÷ Truck Capacity (tons)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Material Densities</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Sand:</strong> 1600 kg/m³ (loose), 1800 kg/m³ (compacted)</p>
                    <p><strong>Gravel:</strong> 1680 kg/m³</p>
                    <p><strong>Stone Aggregate:</strong> 1700 kg/m³</p>
                    <p><strong>Crushed Stone:</strong> 1650 kg/m³</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Important Notes</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Moisture content affects weight</li>
                    <li>Compacted materials are denser</li>
                    <li>Truck capacity varies: 10-30 tons typical</li>
                    <li>Order 5-10% extra for wastage</li>
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
