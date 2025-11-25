import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface SheetMetalGaugeConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const gaugeThickness = [
  { gauge: "10", thickness: 3.416, inches: 0.1345 },
  { gauge: "12", thickness: 2.656, inches: 0.1046 },
  { gauge: "14", thickness: 1.897, inches: 0.0747 },
  { gauge: "16", thickness: 1.519, inches: 0.0598 },
  { gauge: "18", thickness: 1.214, inches: 0.0478 },
  { gauge: "20", thickness: 0.912, inches: 0.0359 },
  { gauge: "22", thickness: 0.759, inches: 0.0299 },
  { gauge: "24", thickness: 0.607, inches: 0.0239 },
  { gauge: "26", thickness: 0.455, inches: 0.0179 },
];

export const SheetMetalGaugeConverterModal = ({ isOpen, onClose }: SheetMetalGaugeConverterModalProps) => {
  const [conversionType, setConversionType] = useState<"gauge-to-thickness" | "thickness-to-gauge">("gauge-to-thickness");
  const [selectedGauge, setSelectedGauge] = useState("18");
  const [thickness, setThickness] = useState("");
  const [result, setResult] = useState<{ gauge: string; thicknessMM: string; thicknessInch: string } | null>(null);

  const handleCalculate = () => {
    if (conversionType === "gauge-to-thickness") {
      const gaugeData = gaugeThickness.find(g => g.gauge === selectedGauge);
      if (gaugeData) {
        setResult({
          gauge: gaugeData.gauge,
          thicknessMM: gaugeData.thickness.toFixed(3),
          thicknessInch: gaugeData.inches.toFixed(4)
        });
      }
    } else {
      const thicknessValue = parseFloat(thickness);
      const closestGauge = gaugeThickness.reduce((prev, curr) => 
        Math.abs(curr.thickness - thicknessValue) < Math.abs(prev.thickness - thicknessValue) ? curr : prev
      );
      setResult({
        gauge: closestGauge.gauge,
        thicknessMM: closestGauge.thickness.toFixed(3),
        thicknessInch: closestGauge.inches.toFixed(4)
      });
    }
  };

  const handleReset = () => {
    setThickness("");
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sheet Metal Gauge ↔ Thickness Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Conversion Type</Label>
                <Select value={conversionType} onValueChange={(v: any) => setConversionType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gauge-to-thickness">Gauge to Thickness</SelectItem>
                    <SelectItem value="thickness-to-gauge">Thickness to Gauge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {conversionType === "gauge-to-thickness" ? (
                <div className="space-y-2">
                  <Label htmlFor="gauge">Gauge Number</Label>
                  <Select value={selectedGauge} onValueChange={setSelectedGauge}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gaugeThickness.map(g => (
                        <SelectItem key={g.gauge} value={g.gauge}>
                          Gauge {g.gauge}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="thickness">Thickness (mm)</Label>
                  <Input
                    id="thickness"
                    type="number"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    placeholder="Enter thickness in mm"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleCalculate}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Convert
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-md border border-input hover:bg-accent"
                >
                  Reset
                </button>
              </div>

              {result && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Results</h3>
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gauge:</span>
                        <span className="font-medium">{result.gauge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Thickness (mm):</span>
                        <span className="font-medium">{result.thicknessMM} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Thickness (inches):</span>
                        <span className="font-medium">{result.thicknessInch}"</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3>Standard Sheet Metal Gauge Chart (Steel)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr>
                      <th className="border p-2">Gauge</th>
                      <th className="border p-2">Thickness (mm)</th>
                      <th className="border p-2">Thickness (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gaugeThickness.map(g => (
                      <tr key={g.gauge}>
                        <td className="border p-2">{g.gauge}</td>
                        <td className="border p-2">{g.thickness}</td>
                        <td className="border p-2">{g.inches}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Note: This chart is for standard steel sheet metal. Aluminum and other materials may have different gauge standards.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
