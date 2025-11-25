import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface PipeDiameterConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const pipeData = [
  { nb: "15mm (1/2\")", od: 21.3, schedule40: 2.77, schedule80: 3.73 },
  { nb: "20mm (3/4\")", od: 26.7, schedule40: 2.87, schedule80: 3.91 },
  { nb: "25mm (1\")", od: 33.4, schedule40: 3.38, schedule80: 4.55 },
  { nb: "32mm (1.25\")", od: 42.2, schedule40: 3.56, schedule80: 4.85 },
  { nb: "40mm (1.5\")", od: 48.3, schedule40: 3.68, schedule80: 5.08 },
  { nb: "50mm (2\")", od: 60.3, schedule40: 3.91, schedule80: 5.54 },
  { nb: "65mm (2.5\")", od: 73.0, schedule40: 5.16, schedule80: 7.01 },
  { nb: "80mm (3\")", od: 88.9, schedule40: 5.49, schedule80: 7.62 },
  { nb: "100mm (4\")", od: 114.3, schedule40: 6.02, schedule80: 8.56 },
];

export const PipeDiameterConverterModal = ({ isOpen, onClose }: PipeDiameterConverterModalProps) => {
  const [selectedPipe, setSelectedPipe] = useState(pipeData[4].nb);
  const [schedule, setSchedule] = useState<"schedule40" | "schedule80">("schedule40");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const pipe = pipeData.find(p => p.nb === selectedPipe);
    if (pipe) {
      const thickness = pipe[schedule];
      const id = pipe.od - (2 * thickness);
      setResult({
        nominalBore: pipe.nb,
        outsideDiameter: pipe.od.toFixed(2),
        wallThickness: thickness.toFixed(2),
        insideDiameter: id.toFixed(2)
      });
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pipe Diameter Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Nominal Bore (NB)</Label>
                <Select value={selectedPipe} onValueChange={setSelectedPipe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pipeData.map(p => (
                      <SelectItem key={p.nb} value={p.nb}>
                        {p.nb}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select value={schedule} onValueChange={(v: any) => setSchedule(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule40">Schedule 40 (Standard)</SelectItem>
                    <SelectItem value="schedule80">Schedule 80 (Extra Heavy)</SelectItem>
                  </SelectContent>
                </Select>
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
                        <span className="text-muted-foreground">Nominal Bore:</span>
                        <span className="font-medium">{result.nominalBore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Outside Diameter (OD):</span>
                        <span className="font-medium">{result.outsideDiameter} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wall Thickness:</span>
                        <span className="font-medium">{result.wallThickness} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Inside Diameter (ID):</span>
                        <span className="font-medium">{result.insideDiameter} mm</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3>Pipe Dimensions Reference</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border text-sm">
                  <thead>
                    <tr>
                      <th className="border p-2">Nominal Bore</th>
                      <th className="border p-2">OD (mm)</th>
                      <th className="border p-2">Sch 40 (mm)</th>
                      <th className="border p-2">Sch 80 (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pipeData.map(p => (
                      <tr key={p.nb}>
                        <td className="border p-2">{p.nb}</td>
                        <td className="border p-2">{p.od}</td>
                        <td className="border p-2">{p.schedule40}</td>
                        <td className="border p-2">{p.schedule80}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 className="mt-4">About Pipe Schedules</h3>
              <ul>
                <li><strong>Schedule 40:</strong> Standard wall thickness, most common for general applications</li>
                <li><strong>Schedule 80:</strong> Extra heavy wall thickness, used for high-pressure applications</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
