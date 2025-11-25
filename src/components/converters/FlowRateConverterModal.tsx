import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FlowRateConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FlowRateUnit = "lpm" | "m3hr" | "gpm" | "lps" | "cfs";

const flowRateUnits: { value: FlowRateUnit; label: string }[] = [
  { value: "lpm", label: "Liters per minute (L/min)" },
  { value: "lps", label: "Liters per second (L/s)" },
  { value: "m3hr", label: "Cubic meters per hour (m³/hr)" },
  { value: "gpm", label: "Gallons per minute (gpm)" },
  { value: "cfs", label: "Cubic feet per second (cfs)" },
];

export const FlowRateConverterModal = ({ open, onOpenChange }: FlowRateConverterModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<FlowRateUnit>("lpm");
  const [toUnit, setToUnit] = useState<FlowRateUnit>("m3hr");

  const convertFlowRate = (value: number, from: FlowRateUnit, to: FlowRateUnit): number => {
    if (from === to) return value;
    
    // Convert to L/min first
    let lpm = value;
    if (from === "lps") lpm = value * 60;
    if (from === "m3hr") lpm = (value * 1000) / 60;
    if (from === "gpm") lpm = value * 3.78541;
    if (from === "cfs") lpm = value * 1699.01;
    
    // Convert from L/min to target unit
    if (to === "lpm") return lpm;
    if (to === "lps") return lpm / 60;
    if (to === "m3hr") return (lpm * 60) / 1000;
    if (to === "gpm") return lpm / 3.78541;
    if (to === "cfs") return lpm / 1699.01;
    
    return value;
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return "0.00";
    return convertFlowRate(value, fromUnit, toUnit).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Flow Rate Converter</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Unit</Label>
              <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as FlowRateUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {flowRateUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter flow rate"
              />
            </div>

            <div className="space-y-2">
              <Label>To Unit</Label>
              <Select value={toUnit} onValueChange={(v) => setToUnit(v as FlowRateUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {flowRateUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                value={handleConvert()}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
            <p className="font-semibold">Typical Flow Rates:</p>
            <p>• Kitchen sink: 8-12 L/min</p>
            <p>• Shower: 10-15 L/min</p>
            <p>• Fire hydrant: 1000+ L/min</p>
            <p>• Industrial pump: 100-10000 L/min</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
