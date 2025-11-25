import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VoltageConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type VoltageUnit = "v" | "mv" | "kv" | "mv-milli";

const voltageUnits: { value: VoltageUnit; label: string }[] = [
  { value: "mv-milli", label: "Millivolts (mV)" },
  { value: "v", label: "Volts (V)" },
  { value: "kv", label: "Kilovolts (kV)" },
  { value: "mv", label: "Megavolts (MV)" },
];

export const VoltageConverterModal = ({ open, onOpenChange }: VoltageConverterModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<VoltageUnit>("v");
  const [toUnit, setToUnit] = useState<VoltageUnit>("kv");

  const convertVoltage = (value: number, from: VoltageUnit, to: VoltageUnit): number => {
    if (from === to) return value;
    
    // Convert to volts first
    let volts = value;
    if (from === "mv-milli") volts = value / 1000;
    if (from === "kv") volts = value * 1000;
    if (from === "mv") volts = value * 1000000;
    
    // Convert from volts to target unit
    if (to === "v") return volts;
    if (to === "mv-milli") return volts * 1000;
    if (to === "kv") return volts / 1000;
    if (to === "mv") return volts / 1000000;
    
    return value;
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return "0.0000";
    return convertVoltage(value, fromUnit, toUnit).toFixed(4);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Voltage Converter</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Unit</Label>
              <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as VoltageUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voltageUnits.map((unit) => (
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
                placeholder="Enter voltage"
              />
            </div>

            <div className="space-y-2">
              <Label>To Unit</Label>
              <Select value={toUnit} onValueChange={(v) => setToUnit(v as VoltageUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voltageUnits.map((unit) => (
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
            <p className="font-semibold">Common Voltage Levels:</p>
            <p>• Low Voltage (LV): Up to 1 kV</p>
            <p>• Medium Voltage (MV): 1-35 kV</p>
            <p>• High Voltage (HV): 35-230 kV</p>
            <p>• Extra High Voltage (EHV): Above 230 kV</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
