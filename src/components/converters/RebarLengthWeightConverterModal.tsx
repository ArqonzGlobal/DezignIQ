import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface RebarLengthWeightConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const rebarDiameters = [
  { size: "6mm", weightPerMeter: 0.222 },
  { size: "8mm", weightPerMeter: 0.395 },
  { size: "10mm", weightPerMeter: 0.617 },
  { size: "12mm", weightPerMeter: 0.888 },
  { size: "16mm", weightPerMeter: 1.579 },
  { size: "20mm", weightPerMeter: 2.466 },
  { size: "25mm", weightPerMeter: 3.854 },
  { size: "32mm", weightPerMeter: 6.313 },
];

export const RebarLengthWeightConverterModal = ({ isOpen, onClose }: RebarLengthWeightConverterModalProps) => {
  const [diameter, setDiameter] = useState("12mm");
  const [length, setLength] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<{ length: string; weight: string } | null>(null);

  const getWeightPerMeter = (size: string) => {
    return rebarDiameters.find(d => d.size === size)?.weightPerMeter || 0;
  };

  const handleCalculate = () => {
    const weightPerMeter = getWeightPerMeter(diameter);
    
    if (length) {
      const lengthValue = parseFloat(length);
      const calculatedWeight = lengthValue * weightPerMeter;
      setResult({
        length: lengthValue.toFixed(2),
        weight: calculatedWeight.toFixed(3)
      });
    } else if (weight) {
      const weightValue = parseFloat(weight);
      const calculatedLength = weightValue / weightPerMeter;
      setResult({
        length: calculatedLength.toFixed(2),
        weight: weightValue.toFixed(3)
      });
    }
  };

  const handleReset = () => {
    setLength("");
    setWeight("");
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rebar Length ↔ Weight Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Formula</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="diameter">Rebar Diameter</Label>
                <Select value={diameter} onValueChange={setDiameter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rebarDiameters.map(d => (
                      <SelectItem key={d.size} value={d.size}>
                        {d.size} ({d.weightPerMeter} kg/m)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (meters)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={length}
                    onChange={(e) => {
                      setLength(e.target.value);
                      setWeight("");
                    }}
                    placeholder="Enter length"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => {
                      setWeight(e.target.value);
                      setLength("");
                    }}
                    placeholder="Enter weight"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCalculate}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Calculate
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
                        <span className="text-muted-foreground">Length:</span>
                        <span className="font-medium">{result.length} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="font-medium">{result.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight/meter:</span>
                        <span className="font-medium">{getWeightPerMeter(diameter)} kg/m</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3>Formula</h3>
              <p>Weight = Length × Weight per meter</p>
              <p>Weight per meter = (D² / 162.2)</p>
              <p>Where D is the diameter in mm</p>

              <h3>Standard Rebar Weights</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr>
                      <th className="border p-2">Diameter</th>
                      <th className="border p-2">Weight/meter (kg/m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rebarDiameters.map(d => (
                      <tr key={d.size}>
                        <td className="border p-2">{d.size}</td>
                        <td className="border p-2">{d.weightPerMeter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
