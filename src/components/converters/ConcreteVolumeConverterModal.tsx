import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";

interface ConcreteVolumeConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MixRatio = '1:2:4' | '1:1.5:3' | '1:1:2' | 'custom';

export const ConcreteVolumeConverterModal = ({ isOpen, onClose }: ConcreteVolumeConverterModalProps) => {
  const [volume, setVolume] = useState<number>(1); // m³
  const [mixRatio, setMixRatio] = useState<MixRatio>('1:2:4');
  const [cementBagSize, setCementBagSize] = useState<number>(50); // kg

  const mixRatios = {
    '1:2:4': { cement: 1, sand: 2, aggregate: 4, grade: 'M15' },
    '1:1.5:3': { cement: 1, sand: 1.5, aggregate: 3, grade: 'M20' },
    '1:1:2': { cement: 1, sand: 1, aggregate: 2, grade: 'M25' },
  };

  const calculate = () => {
    const ratio = mixRatios[mixRatio as keyof typeof mixRatios];
    if (!ratio) return { cementBags: 0, sand: 0, aggregate: 0, water: 0 };

    const totalRatio = ratio.cement + ratio.sand + ratio.aggregate;
    const dryVolume = volume * 1.54; // 54% increase for dry volume

    // Calculate quantities
    const cementVolume = (dryVolume * ratio.cement) / totalRatio;
    const sandVolume = (dryVolume * ratio.sand) / totalRatio;
    const aggregateVolume = (dryVolume * ratio.aggregate) / totalRatio;

    // Cement: 1440 kg/m³, 1 bag = 50kg = 0.0347 m³
    const cementWeight = cementVolume * 1440;
    const cementBags = cementWeight / cementBagSize;

    // Water: typically 0.45 water-cement ratio
    const water = cementWeight * 0.45;

    return {
      cementBags: cementBags,
      cementWeight: cementWeight,
      sand: sandVolume,
      aggregate: aggregateVolume,
      water: water,
      grade: ratio.grade,
    };
  };

  const result = calculate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Concrete Volume Converter
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
                  <Label>Concrete Volume (m³)</Label>
                  <Input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value) || 0)}
                    placeholder="Enter volume"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mix Ratio (Cement:Sand:Aggregate)</Label>
                  <Select value={mixRatio} onValueChange={(v) => setMixRatio(v as MixRatio)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:2:4">1:2:4 (M15) - General use</SelectItem>
                      <SelectItem value="1:1.5:3">1:1.5:3 (M20) - Beams, columns</SelectItem>
                      <SelectItem value="1:1:2">1:1:2 (M25) - Heavy duty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cement Bag Size (kg)</Label>
                  <Select value={cementBagSize.toString()} onValueChange={(v) => setCementBagSize(Number(v))}>
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
              </div>

              <div className="space-y-4">
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Material Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Concrete Grade:</span>
                      <span className="text-lg font-bold text-primary">{result.grade}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Cement Bags:</span>
                      <span className="text-xl font-bold">{result.cementBags.toFixed(2)} bags</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Cement Weight:</span>
                      <span className="text-lg font-semibold">{result.cementWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Sand:</span>
                      <span className="text-lg font-semibold">{result.sand.toFixed(3)} m³</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Aggregate:</span>
                      <span className="text-lg font-semibold">{result.aggregate.toFixed(3)} m³</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Water:</span>
                      <span className="text-lg font-semibold">{result.water.toFixed(2)} liters</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Concrete Mix Formulas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Calculation Method</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Dry Volume = Wet Volume × 1.54</li>
                    <li>Material Volume = (Dry Volume × Ratio Part) ÷ Total Ratio</li>
                    <li>Cement Weight = Cement Volume × 1440 kg/m³</li>
                    <li>Water = Cement Weight × 0.45 (water-cement ratio)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Common Mix Ratios</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>1:2:4 (M15):</strong> General construction, non-load bearing</p>
                    <p><strong>1:1.5:3 (M20):</strong> Beams, columns, slabs</p>
                    <p><strong>1:1:2 (M25):</strong> Heavy-duty structures</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Add 5-10% extra for wastage</li>
                    <li>Use clean water for mixing</li>
                    <li>Proper curing is essential for strength</li>
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
