import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench } from "lucide-react";

interface SteelWeightConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SteelWeightConverterModal = ({ isOpen, onClose }: SteelWeightConverterModalProps) => {
  const [diameter, setDiameter] = useState<number>(12); // mm
  const [length, setLength] = useState<number>(12); // m
  const steelDensity = 7850; // kg/m³

  // Weight formula for steel bar: (D²/162) × Length
  // Where D is diameter in mm, Length in meters
  const calculateWeight = () => {
    const weightPerMeter = (diameter * diameter) / 162;
    const totalWeight = weightPerMeter * length;
    return {
      weightPerMeter,
      totalWeight,
      numberOfBars: 1,
    };
  };

  const result = calculateWeight();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Steel Weight Converter
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
                  <Label>Bar Diameter (mm)</Label>
                  <Select value={diameter.toString()} onValueChange={(v) => setDiameter(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 mm</SelectItem>
                      <SelectItem value="8">8 mm</SelectItem>
                      <SelectItem value="10">10 mm</SelectItem>
                      <SelectItem value="12">12 mm</SelectItem>
                      <SelectItem value="16">16 mm</SelectItem>
                      <SelectItem value="20">20 mm</SelectItem>
                      <SelectItem value="25">25 mm</SelectItem>
                      <SelectItem value="32">32 mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Length (meters)</Label>
                  <Input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value) || 0)}
                    placeholder="Enter length"
                  />
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p className="font-semibold">Formula Used:</p>
                      <p className="text-muted-foreground">
                        Weight = (D² ÷ 162) × Length
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        D = Diameter in mm, Length in meters
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
                      <span className="text-sm text-muted-foreground">Weight per Meter:</span>
                      <span className="text-xl font-bold text-primary">{result.weightPerMeter.toFixed(3)} kg/m</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Total Weight:</span>
                      <span className="text-2xl font-bold">{result.totalWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Diameter:</span>
                      <span className="text-lg font-semibold">{diameter} mm</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Length:</span>
                      <span className="text-lg font-semibold">{length} m</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Steel Bar Weight Formula</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Weight Calculation</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Weight (kg/m) = (D² ÷ 162)</li>
                    <li>Total Weight = Weight per meter × Length</li>
                    <li>D = Diameter in millimeters</li>
                    <li>Steel density = 7850 kg/m³</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Common Bar Sizes & Weights</h4>
                  <div className="text-sm space-y-1">
                    <p>6mm: 0.222 kg/m</p>
                    <p>8mm: 0.395 kg/m</p>
                    <p>10mm: 0.617 kg/m</p>
                    <p>12mm: 0.888 kg/m</p>
                    <p>16mm: 1.578 kg/m</p>
                    <p>20mm: 2.466 kg/m</p>
                    <p>25mm: 3.854 kg/m</p>
                    <p>32mm: 6.313 kg/m</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
