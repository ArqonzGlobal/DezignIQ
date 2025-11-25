import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SlopeConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SlopeUnit = "degree" | "percent" | "ratio";

const slopeUnits: { value: SlopeUnit; label: string }[] = [
  { value: "degree", label: "Degrees (°)" },
  { value: "percent", label: "Percent (%)" },
  { value: "ratio", label: "Ratio (1:X)" },
];

export const SlopeConverterModal = ({ open, onOpenChange }: SlopeConverterModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<SlopeUnit>("degree");
  const [toUnit, setToUnit] = useState<SlopeUnit>("percent");

  const convertSlope = (value: number, from: SlopeUnit, to: SlopeUnit): number => {
    if (from === to) return value;
    
    let degrees = value;
    
    // Convert input to degrees first
    if (from === "percent") {
      degrees = Math.atan(value / 100) * (180 / Math.PI);
    } else if (from === "ratio") {
      degrees = Math.atan(1 / value) * (180 / Math.PI);
    }
    
    // Convert degrees to target unit
    if (to === "degree") return degrees;
    if (to === "percent") return Math.tan(degrees * (Math.PI / 180)) * 100;
    if (to === "ratio") return 1 / Math.tan(degrees * (Math.PI / 180));
    
    return value;
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return "0.00";
    const result = convertSlope(value, fromUnit, toUnit);
    return toUnit === "ratio" ? `1:${result.toFixed(2)}` : result.toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Slope / Gradient Converter</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Unit</Label>
              <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as SlopeUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {slopeUnits.map((unit) => (
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
                placeholder="Enter slope value"
              />
            </div>

            <div className="space-y-2">
              <Label>To Unit</Label>
              <Select value={toUnit} onValueChange={(v) => setToUnit(v as SlopeUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {slopeUnits.map((unit) => (
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
            <p className="font-semibold">Common Slope Examples:</p>
            <p>• 45° = 100% = 1:1 ratio</p>
            <p>• 26.57° = 50% = 1:2 ratio</p>
            <p>• 5.71° = 10% = 1:10 ratio</p>
            <p>• 2% slope = minimum for drainage</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
