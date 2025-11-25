import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CurrentConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CurrentUnit = "a" | "ma" | "ka" | "ua";

const currentUnits: { value: CurrentUnit; label: string }[] = [
  { value: "ua", label: "Microamperes (µA)" },
  { value: "ma", label: "Milliamperes (mA)" },
  { value: "a", label: "Amperes (A)" },
  { value: "ka", label: "Kiloamperes (kA)" },
];

export const CurrentConverterModal = ({ open, onOpenChange }: CurrentConverterModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<CurrentUnit>("a");
  const [toUnit, setToUnit] = useState<CurrentUnit>("ma");

  const convertCurrent = (value: number, from: CurrentUnit, to: CurrentUnit): number => {
    if (from === to) return value;
    
    // Convert to amperes first
    let amperes = value;
    if (from === "ua") amperes = value / 1000000;
    if (from === "ma") amperes = value / 1000;
    if (from === "ka") amperes = value * 1000;
    
    // Convert from amperes to target unit
    if (to === "a") return amperes;
    if (to === "ua") return amperes * 1000000;
    if (to === "ma") return amperes * 1000;
    if (to === "ka") return amperes / 1000;
    
    return value;
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return "0.0000";
    return convertCurrent(value, fromUnit, toUnit).toFixed(4);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Current Converter</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Unit</Label>
              <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as CurrentUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map((unit) => (
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
                placeholder="Enter current"
              />
            </div>

            <div className="space-y-2">
              <Label>To Unit</Label>
              <Select value={toUnit} onValueChange={(v) => setToUnit(v as CurrentUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map((unit) => (
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
            <p className="font-semibold">Typical Current Ratings:</p>
            <p>• Residential circuits: 10-40 A</p>
            <p>• Industrial circuits: 100-800 A</p>
            <p>• Control circuits: 1-10 mA</p>
            <p>• High-power transmission: Several kA</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
